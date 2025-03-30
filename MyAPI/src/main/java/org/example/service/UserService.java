package org.example.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.config.security.JwtService;
import org.example.dto.LoginDto;
import org.example.dto.RegisterDto;
import org.example.entities.RoleEntity;
import org.example.entities.UserEntity;
import org.example.entities.UserRoleEntity;
import org.example.repository.IRoleRepository;
import org.example.repository.IUserRepository;
import org.example.repository.IUserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@RequiredArgsConstructor
@Service
public class UserService {
    @Value("${google.api.userinfo}")
    private String googleUserInfoUrl;
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IRoleRepository roleRepository;
    @Autowired
    private IUserRoleRepository userRoleRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserEntity user = new UserEntity(null,
            registerDto.getUsername(),
            registerDto.getEmail(),
            passwordEncoder.encode(registerDto.getPassword()), null);
        user = userRepository.save(user);

        RoleEntity role = roleRepository.findByName("USER").orElseThrow();
        UserRoleEntity userRole = new UserRoleEntity(null, user, role);
        userRoleRepository.save(userRole);

        return jwtService.generateAccessToken(user);
    }

    public String login(LoginDto loginDto) {
        UserEntity user = userRepository.findByUsername(loginDto.getUsername()).orElseThrow();

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return jwtService.generateAccessToken(user);
    }

    @Transactional
    public String loginWithGoogle(String token) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(googleUserInfoUrl, HttpMethod.GET, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) return null;

        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> userinfo = mapper.readValue(response.getBody(), new TypeReference<Map<String, String>>() {});
        UserEntity userEntity = userRepository.findByUsername(userinfo.get("email")).orElse(null);

        if (userEntity == null) {
            userEntity = new UserEntity();
            userEntity.setUsername(userinfo.get("email"));
            userEntity.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            userEntity = userRepository.save(userEntity);
            RoleEntity role = roleRepository.findByName("USER").orElseThrow();
            UserRoleEntity userRole = new UserRoleEntity(null, userEntity, role);
            userRoleRepository.save(userRole);
        }

        return jwtService.generateAccessToken(userEntity);
    }
}