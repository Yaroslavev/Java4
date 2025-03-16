package org.example.seeder;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class DatabaseSeeder implements CommandLineRunner {
    private CategorySeeder categorySeeder;
    private RoleSeeder roleSeeder;
    private UserSeeder userSeeder;


    @Override
    public void run(String... args) {
        categorySeeder.seed();
        roleSeeder.seed();
        userSeeder.seed();
    }
}