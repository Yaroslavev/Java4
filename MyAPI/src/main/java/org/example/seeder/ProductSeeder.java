package org.example.seeder;

import org.example.entities.CategoryEntity;
import org.example.entities.ProductEntity;
import org.example.repository.ICategoryRepository;
import org.example.repository.IProductRepository;
import org.example.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class ProductSeeder {
    @Autowired
    private IProductRepository productRepository;
    @Autowired
    private ICategoryRepository categoryRepository;
    @Autowired
    private ImageService imageService;

    public void seed() {
        if (productRepository.count() == 0) {
            ProductEntity product1 = new ProductEntity();
            CategoryEntity category1 = categoryRepository.findByName("Electronics").get();
            product1.setName("Iphone");
            product1.setCost(999.9);
            product1.setImage(imageService.downloadImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fintercomp.com.mt%2Fwp-content%2Fuploads%2F2022%2F09%2FApple-iPhone-14-Blue.jpg&f=1&nofb=1&ipt=8ed28eff021671d7efc622bf3cf584f37e06e7ab34a1394a0fbc0f1390468510&ipo=images"));
            product1.setCategory(category1);

            ProductEntity product2 = new ProductEntity();
            CategoryEntity category2 = categoryRepository.findByName("Electronics").get();
            product2.setName("Tv");
            product2.setCost(1700.94);
            product2.setImage(imageService.downloadImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fintercompras.com%2Fimages%2Fproduct%2FLG_55UJ6200.jpg&f=1&nofb=1&ipt=b02f617fc4aa0af0d37c7dcaa47ded2c7b81bb6aef49cecde392fef85e891273&ipo=images"));
            product2.setCategory(category2);

            ProductEntity product3 = new ProductEntity();
            CategoryEntity category3 = categoryRepository.findByName("Clothing").get();
            product3.setName("Hoodie");
            product3.setCost(10.12);
            product3.setImage(imageService.downloadImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F81P4EN0xIeL.jpg&f=1&nofb=1&ipt=dbd896892077ac1444b8a1d9105ad764df3b47e20d5b5cf4e4857d13e5ee4dec&ipo=images"));
            product3.setCategory(category3);

            productRepository.saveAll(Arrays.asList(product1, product2, product3));
        }
    }
}