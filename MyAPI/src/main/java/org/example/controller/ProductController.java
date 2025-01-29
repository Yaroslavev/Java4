package org.example.controller;

import org.example.dto.ProductPostDto;
import org.example.entities.ProductEntity;
import org.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    ProductService productService;

    @GetMapping
    public List<ProductEntity> getAllProducts() { return productService.getAllProducts(); }

    @GetMapping("/{id}")
    public ResponseEntity<ProductEntity> getProductById(@PathVariable int id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> createProduct(@ModelAttribute ProductPostDto product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping(value = "/{id}", consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> updateProduct(@ModelAttribute ProductPostDto product, @PathVariable int id) {
        return ResponseEntity.ok(productService.updateProduct(product, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);

        return ResponseEntity.ok(Collections.singletonMap("message", "Product deleted successfully."));
    }
}
