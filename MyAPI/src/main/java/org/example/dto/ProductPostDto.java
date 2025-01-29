package org.example.dto;

import lombok.Data;
import org.example.entities.CategoryEntity;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductPostDto {
    private String name;
    private double cost;
    private int categoryId;
    private MultipartFile image;
}
