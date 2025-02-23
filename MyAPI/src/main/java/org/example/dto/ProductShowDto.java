package org.example.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductShowDto {
    private Integer id;
    private String name;
    private double cost;
    private CategoryShowDto category;
    private List<ProductImageShowDto> images;
}
