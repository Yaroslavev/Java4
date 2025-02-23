package org.example.service;

import lombok.AllArgsConstructor;
import org.example.dto.CategoryPostDto;
import org.example.dto.CategoryShowDto;
import org.example.entities.CategoryEntity;
import org.example.mapper.CategoryMapper;
import org.example.repository.ICategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {
    private ICategoryRepository categoryRepository;
    private CategoryMapper categoryMapper;

    public List<CategoryShowDto> getAllCategories() {
        return categoryMapper.toDto(categoryRepository.findAll());
    }

    public CategoryShowDto getCategoryById(int id) {
        return categoryMapper.toDto(categoryRepository.findById(id).get());
    }

    public CategoryShowDto createCategory(CategoryPostDto category) {
        CategoryEntity _category = new CategoryEntity();
        _category.setName(category.getName());

        return categoryMapper.toDto(categoryRepository.save(_category));
    }

    public CategoryShowDto updateCategory(CategoryPostDto category, int id) {
        CategoryEntity _category = categoryRepository.findById(id).get();

        _category.setName(category.getName());
        return categoryMapper.toDto(categoryRepository.save(_category));
    }

    public void deleteCategory(int id) {
        categoryRepository.deleteById(id);
    }
}
