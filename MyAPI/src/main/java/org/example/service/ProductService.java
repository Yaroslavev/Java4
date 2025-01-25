package org.example.service;

import org.example.entities.CategoryEntity;
import org.example.entities.ProductEntity;
import org.example.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    IProductRepository productRepository;
    @Autowired
    ImageService imageService;

    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    public ProductEntity getProductById(int id) {
        return productRepository.findById(id).get();
    }

    public ProductEntity createProduct(ProductEntity product) {
        ProductEntity _product = new ProductEntity();
        _product.setName(product.getName());
        _product.setCost(product.getCost());
        _product.setImage(imageService.downloadImage(product.getImage()));
        _product.setCategory(product.getCategory());

        return productRepository.save(_product);
    }

    public ProductEntity updateProduct(ProductEntity product, int id) {
        ProductEntity _product = productRepository.findById(id).get();

        _product.setName(product.getName());
        _product.setCost(product.getCost());
        if (!_product.getImage().equals(product.getImage())) {
            imageService.deleteImage(_product.getImage());
            _product.setImage(imageService.downloadImage(product.getImage()));
        } else {
            _product.setImage((product.getImage()));
        }
        _product.setCategory(product.getCategory());

        return productRepository.save(_product);
    }

    public void deleteProduct(int id) {
        imageService.deleteImage(productRepository.findById(id).get().getImage());
        productRepository.deleteById(id);
    }
}
