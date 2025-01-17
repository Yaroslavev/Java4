package org.example.seeder;

import org.example.entities.CategoryEntity;
import org.example.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class CategorySeeder {
    @Autowired
    private ICategoryRepository categoryRepository;

    public void seed() {
        if (categoryRepository.count() == 0) {
            CategoryEntity category1 = new CategoryEntity();
            category1.setName("Electronics");

            CategoryEntity category2 = new CategoryEntity();
            category2.setName("Books");

            CategoryEntity category3 = new CategoryEntity();
            category3.setName("Clothing");

            categoryRepository.saveAll(Arrays.asList(category1, category2, category3));
        }
    }
}