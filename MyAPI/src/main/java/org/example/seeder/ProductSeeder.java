package org.example.seeder;

import org.example.entities.CategoryEntity;
import org.example.entities.ProductEntity;
import org.example.repository.ICategoryRepository;
import org.example.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class ProductSeeder {
    @Autowired
    private IProductRepository productRepository;
    @Autowired
    private ICategoryRepository categoryRepository;

    public void seed() {
        if (productRepository.count() == 0) {
            ProductEntity product1 = new ProductEntity();
            CategoryEntity category1 = categoryRepository.findByName("Electronics").get();
            product1.setName("Iphone");
            product1.setCost(999.9);
            product1.setCategory(category1);

            ProductEntity product2 = new ProductEntity();
            CategoryEntity category2 = categoryRepository.findByName("Electronics").get();
            product2.setName("Tv");
            product2.setCost(1700.94);
            product2.setCategory(category2);

            ProductEntity product3 = new ProductEntity();
            CategoryEntity category3 = categoryRepository.findByName("Clothing").get();
            product3.setName("Hoodie");
            product3.setCost(10.12);
            product3.setCategory(category3);

            productRepository.saveAll(Arrays.asList(product1, product2, product3));
        }
    }
}