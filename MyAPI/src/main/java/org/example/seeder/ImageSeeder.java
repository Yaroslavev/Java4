package org.example.seeder;

import org.example.service.ImageService;
import org.junit.jupiter.api.AutoClose;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class ImageSeeder {
    @Autowired
    ImageService imageService;
    private final String directory = "images";

    public void seed() {

        try {
            Path path = Paths.get(directory);

            if (!Files.exists(path)) {
                Files.createDirectory(path);
                imageService.downloadImage("https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_640.jpg", "test.jpg");
                imageService.downloadImage("https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg", "cat.jpg");
                imageService.downloadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Arduino_ftdi_chip-1.jpg/1200px-Arduino_ftdi_chip-1.jpg", "electronics.jpg");
            }
        }
        catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
