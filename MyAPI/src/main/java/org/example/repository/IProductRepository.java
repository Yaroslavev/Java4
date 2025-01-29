package org.example.repository;

import org.example.entities.ProductEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductRepository extends JpaRepository<ProductEntity, Integer> {
    @EntityGraph(attributePaths = {"category"})
    List<ProductEntity> findAll();
}
