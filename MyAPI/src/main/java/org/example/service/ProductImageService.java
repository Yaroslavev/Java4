package org.example.service;

import lombok.AllArgsConstructor;
import org.example.entities.ProductImageEntity;
import org.example.repository.IProductImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductImageService {
    private IProductImageRepository productImageRepository;
    private FileService fileService;

    void deleteProductImage(int id) {
        ProductImageEntity entity = productImageRepository.findById(id).get();
        fileService.remove(entity);
        productImageRepository.deleteById(id);
    }

    void deleteProductImages(List<ProductImageEntity> images) {
        for (int i = 0; i < images.size(); i++) {
            deleteProductImage(images.get(i).getId());
        }
    }
}
