package org.example.service;

import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.spi.IIORegistry;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {
    @Value("${upload.directory}")
    private String uploadDirectory;
    @Value("${upload.maxSize.small}")
    private int maxSize;

    public ProductImageEntity load(MultipartFile file, ProductEntity product) {
        try {
            // Перевіряємо, чи файл не порожній і чи існує директорія
            if (file.isEmpty()) return null;
            Files.createDirectories(Paths.get(uploadDirectory));

            var newFileName = UUID.randomUUID() + ".webp";
            ProductImageEntity newFile = new ProductImageEntity(newFileName, 1, product);
            Path filePath = Paths.get(uploadDirectory, newFileName);
            optimizeImage(file, filePath);

            return newFile;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public List<ProductImageEntity> load(List<MultipartFile> files, ProductEntity product) {
        try {
            // Перевіряємо, чи файл не порожній і чи існує директорія
            if (files.isEmpty()) return new ArrayList<>();
            Files.createDirectories(Paths.get(uploadDirectory));
            int priority = 0;
            List<ProductImageEntity> images = new ArrayList<>();

            for (int i = 0; i < files.size(); i++) {
                var newFileName = UUID.randomUUID() + ".webp";
                images.add(new ProductImageEntity(newFileName, priority++, product));
                Path filePath = Paths.get(uploadDirectory, newFileName);
                optimizeImage(files.get(i), filePath);
            }

            return images;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ArrayList<>();
        }
    }

    private void optimizeImage(MultipartFile file, Path filePath) throws IOException {
        BufferedImage image = ImageIO.read(file.getInputStream());
        int originalWidth = image.getWidth();
        int originalHeight = image.getHeight();
        int newWidth;
        int newHeight;

        if (originalWidth > originalHeight) {
            newWidth = maxSize;
            newHeight = (int) ((double) originalHeight / originalWidth * maxSize);
        } else {
            newHeight = maxSize;
            newWidth = (int) ((double) originalWidth / originalHeight * maxSize);
        }

        Image scaledImage = image.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);

        BufferedImage optimizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = optimizedImage.createGraphics();
        g2d.drawImage(scaledImage, 0, 0, null);
        g2d.dispose();

        try (ImageOutputStream ios = ImageIO.createImageOutputStream(new File(filePath.toString()))) {
            ImageIO.write(optimizedImage, "webp", ios);
        }
    }

    public void remove(ProductImageEntity file) {
        try {
            Path filePath = Paths.get(uploadDirectory + "/" + file.getImage());
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public void remove(List<ProductImageEntity> images) {
        for (int i = 0; i < images.size(); i++) {
            remove(images.get(i));
        }
    }

    public ProductImageEntity replace(ProductImageEntity oldFile, MultipartFile newFile, ProductEntity product) {
        ProductImageEntity file = load(newFile, product);
        if (file == null){
            return oldFile;
        }
        remove(oldFile);

        return file;
    }

    public List<ProductImageEntity> replace(List<ProductImageEntity> oldFiles, List<MultipartFile> newFiles, ProductEntity product) {
        List<ProductImageEntity> newImages = load(newFiles, product);
        if (newImages.isEmpty()){
            return oldFiles;
        }
        remove(oldFiles);

        return newImages;
    }
}