package org.example.service;

import lombok.AllArgsConstructor;
import org.example.dto.LoginDto;
import org.example.dto.RegisterDto;
import org.example.entities.UserEntity;
import org.example.repository.IUserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {
    private IUserRepository userRepository;
    private JwtService jwtService;

    public String register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(BCrypt.hashpw(registerDto.getPassword(), BCrypt.gensalt()));

        userRepository.save(user);

        return jwtService.generateToken(user.getUsername());
    }

    public String login(LoginDto loginDto) {
        UserEntity user = userRepository.findByEmail(loginDto.getEmail());

        if (user == null || !BCrypt.checkpw(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(user.getUsername());
    }
}
