package org.example.service;

import org.example.dto.CategoryPostDto;
import org.example.entities.CategoryEntity;
import org.example.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private ICategoryRepository categoryRepository;

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    public CategoryEntity getCategoryById(int id) {
        return categoryRepository.findById(id).get();
    }

    public CategoryEntity createCategory(CategoryPostDto category) {
        CategoryEntity _category = new CategoryEntity();
        _category.setName(category.getName());

        return categoryRepository.save(_category);
    }

    public CategoryEntity updateCategory(CategoryPostDto category, int id) {
        CategoryEntity _category = categoryRepository.findById(id).get();

        _category.setName(category.getName());
        return categoryRepository.save(_category);
    }

    public void deleteCategory(int id) {
        categoryRepository.deleteById(id);
    }
}
