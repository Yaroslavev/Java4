package org.example.mapper;

import org.example.dto.ProductShowDto;
import org.example.entities.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductShowDto toDto(ProductEntity product);
    List<ProductShowDto> toDto(List<ProductEntity> products);

    ProductEntity toEntity(ProductShowDto product);
    List<ProductEntity> toEntity(List<ProductShowDto> products);
}
