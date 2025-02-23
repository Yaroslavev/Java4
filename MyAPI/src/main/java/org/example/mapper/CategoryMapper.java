package org.example.mapper;

import org.example.dto.CategoryShowDto;
import org.example.entities.CategoryEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryShowDto toDto(CategoryEntity category);
    List<CategoryShowDto> toDto(List<CategoryEntity> categories);

    CategoryEntity toEntity(CategoryShowDto category);
    List<CategoryEntity> toEntity(List<CategoryShowDto> categories);
}
