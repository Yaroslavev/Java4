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
            }
        }
        catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
