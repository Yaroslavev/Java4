package org.example.service;

import lombok.AllArgsConstructor;
import org.example.config.security.JwtService;
import org.example.dto.LoginDto;
import org.example.dto.RegisterDto;
import org.example.entities.RoleEntity;
import org.example.entities.UserEntity;
import org.example.entities.UserRoleEntity;
import org.example.repository.IRoleRepository;
import org.example.repository.IUserRepository;
import org.example.repository.IUserRoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {
    private IUserRepository userRepository;
    private IRoleRepository roleRepository;
    private IUserRoleRepository userRoleRepository;
    private JwtService jwtService;
    private PasswordEncoder passwordEncoder;

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
}