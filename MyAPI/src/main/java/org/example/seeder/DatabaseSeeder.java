package org.example.seeder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    @Autowired
    private CategorySeeder categorySeeder;
    @Autowired
    ProductSeeder productSeeder;
    @Autowired
    ImageSeeder imageSeeder;

    @Override
    public void run(String... args) throws Exception {
        imageSeeder.seed();
        categorySeeder.seed();
        productSeeder.seed();
    }
}
