package org.example.controller;

import org.example.dto.GoogleAuthDto;
import org.example.dto.LoginDto;
import org.example.dto.RegisterDto;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthenticationController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterDto registerDto) {
        return userService.register(registerDto);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDto loginDto) {
        return userService.login(loginDto);
    }

    @PostMapping("/google")
    public String loginWithGoogle(@RequestBody GoogleAuthDto googleDto) {
        try {
            return userService.loginWithGoogle(googleDto.getToken());
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
