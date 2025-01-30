package org.example.service;

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
import java.util.UUID;

@Service
public class FileService {
    @Value("${upload.directory}")
    private String uploadDirectory;
    @Value("${upload.maxSize.small}")
    private int maxSize;

    public String load(MultipartFile file) {
        try {
            // Перевіряємо, чи файл не порожній і чи існує директорія
            if (file.isEmpty()) return "";
            Files.createDirectories(Paths.get(uploadDirectory));

            var newFileName = UUID.randomUUID() + ".webp";
            Path filePath = Paths.get(uploadDirectory, newFileName);
            optimizeImage(file, filePath);

            return newFileName;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "";
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

    public void remove(String fileName) {
        try {
            Path filePath = Paths.get(uploadDirectory + "/" + fileName);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public String replace(String oldFileName, MultipartFile newFile) {
        var newFileName = load(newFile);
        if (newFileName == ""){
            return oldFileName;
        }
        remove(oldFileName);
        return newFileName;
    }
}