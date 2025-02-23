package org.example.mapper;

import ch.qos.logback.core.model.ComponentModel;
import org.example.dto.ProductImageShowDto;
import org.example.entities.ProductImageEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    ProductImageShowDto toDto(ProductImageEntity productImage);
    List<ProductImageShowDto> toDto(List<ProductImageEntity> productImages);

    ProductImageEntity toEntity(ProductImageShowDto productImage);
    List<ProductImageEntity> toEntity(List<ProductImageShowDto> productImages);
}
