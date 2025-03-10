package org.example.seeder;

import lombok.AllArgsConstructor;
import org.example.entities.RoleEntity;
import org.example.repository.IRoleRepository;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class RoleSeeder {
    IRoleRepository roleRepository;

    public void seed() {
        if (roleRepository.count() != 0) return;

        RoleEntity admin = new RoleEntity(null, "ADMIN");
        RoleEntity user = new RoleEntity(null, "USER");

        roleRepository.save(admin);
        roleRepository.save(user);
    }
}
