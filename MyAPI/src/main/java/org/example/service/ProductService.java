package org.example.service;

import org.example.dto.ProductPostDto;
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
    FileService fileService;
    @Autowired
    CategoryService categoryService;

    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    public ProductEntity getProductById(int id) {
        return productRepository.findById(id).get();
    }

    public ProductEntity createProduct(ProductPostDto product) {
        ProductEntity _product = new ProductEntity();
        _product.setName(product.getName());
        _product.setCost(product.getCost());
        _product.setCategory(categoryService.getCategoryById(product.getCategoryId()));
        _product.setImage(fileService.load(product.getImage()));

        return productRepository.save(_product);
    }

    public ProductEntity updateProduct(ProductPostDto product, int id) {
        ProductEntity _product = productRepository.findById(id).get();

        _product.setName(product.getName());
        _product.setCost(product.getCost());
        _product.setImage(fileService.replace(_product.getImage(), product.getImage()));
        _product.setCategory(categoryService.getCategoryById(product.getCategoryId()));

        return productRepository.save(_product);
    }

    public void deleteProduct(int id) {
        fileService.remove(productRepository.findById(id).get().getImage());
        productRepository.deleteById(id);
    }
}
