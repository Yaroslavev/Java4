package org.example.seeder;

import lombok.AllArgsConstructor;
import org.example.entities.RoleEntity;
import org.example.entities.UserEntity;
import org.example.entities.UserRoleEntity;
import org.example.repository.IRoleRepository;
import org.example.repository.IUserRepository;
import org.example.repository.IUserRoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class UserSeeder {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final IUserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public void seed() {
        if (userRepository.count() != 0) return;

        UserEntity admin = new UserEntity();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));

        admin = userRepository.save(admin);

        RoleEntity adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        UserRoleEntity userRole = new UserRoleEntity(null, admin, adminRole);

        userRoleRepository.save(userRole);
    }
}
