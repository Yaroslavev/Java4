package org.example.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.dto.ProductPostDto;
import org.example.dto.ProductShowDto;
import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.example.mapper.CategoryMapper;
import org.example.mapper.ProductMapper;
import org.example.repository.IProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductService {
    IProductRepository productRepository;
    FileService fileService;
    CategoryService categoryService;
    ProductImageService productImageService;
    CategoryMapper categoryMapper;
    ProductMapper productMapper;

    public List<ProductShowDto> getAllProducts() {
        return productMapper.toDto(productRepository.findAll());
    }

    public ProductShowDto getProductById(int id) {
        return productMapper.toDto(productRepository.findById(id).get());
    }

    @Transactional
    public ProductShowDto createProduct(ProductPostDto product) {
        ProductEntity _product = new ProductEntity();
        _product.setName(product.getName());
        _product.setCost(product.getCost());
        _product.setCategory(categoryMapper.toEntity(categoryService.getCategoryById(product.getCategoryId())));
        List<ProductImageEntity> images = new ArrayList<>();
        _product.setImages(images);
        productRepository.save(_product);

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            images = fileService.load(product.getImages(), _product);
            if (!images.isEmpty()) {
                _product.getImages().addAll(images);
                return productMapper.toDto(productRepository.save(_product));
            }
        }

        return productMapper.toDto(productRepository.save(_product));
    }

    @Transactional
    public ProductShowDto updateProduct(ProductPostDto product, int id) {
        ProductEntity _product = productRepository.findById(id).get();

        _product.setName(product.getName());
        _product.setCost(product.getCost());
        _product.setCategory(categoryMapper.toEntity(categoryService.getCategoryById(product.getCategoryId())));

        if (product.getImages() != null) {
            List<ProductImageEntity> newImages = fileService.load(product.getImages(), _product);
            if (!newImages.isEmpty()) {
                productImageService.deleteProductImages(_product.getImages());
                _product.getImages().clear();
                _product.getImages().addAll(newImages);
            }
        }
        else {
            productImageService.deleteProductImages(_product.getImages());
            _product.getImages().clear();
        }

        return productMapper.toDto(productRepository.save(_product));
    }

    @Transactional
    public void deleteProduct(int id) {
        List<ProductImageEntity> images = productRepository.findById(id).get().getImages();
        fileService.remove(images);
        productImageService.deleteProductImages(images);
        productRepository.deleteById(id);
    }
}
