package org.example.service;

import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {
    private final String directory = "images";

    public void downloadImage(String url, String nameToSave) {
        try {
            URL path = new URL(url);
            InputStream input = path.openStream();
            Path output = Paths.get(directory + "/" + nameToSave);

            Files.copy(input, output);
            input.close();
        }
        catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
