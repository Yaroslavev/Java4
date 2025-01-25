package org.example.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {
    private final String directory = "images";

    public String downloadImage(String url) {

        try {
            URL path = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) path.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            connection.connect();
            String nameToSave = UUID.randomUUID() + getImageExtension(url);
            InputStream input = connection.getInputStream();
            Path output = Paths.get(directory + "/" + nameToSave);

            Files.copy(input, output);
            System.out.printf(nameToSave);
            input.close();

            return nameToSave;
        }
        catch (Exception e) {
            System.err.println(e.getMessage());
            throw new RuntimeException("Failed to download image: " + url);
        }
    }

    public void deleteImage(String imageName) {
        File image = new File(directory + "/" + imageName);

        if (image.exists()) {
            image.delete();
        }
    }

    public String getImageExtension(String url) {
        try {
            String decodedUrl = URLDecoder.decode(url, StandardCharsets.UTF_8);
            int startIndex = decodedUrl.indexOf("u=") + 2;
            int endIndex = decodedUrl.indexOf("&", startIndex);
            String imageUrl = endIndex == -1 ? decodedUrl.substring(startIndex) : decodedUrl.substring(startIndex, endIndex);

            String extension = imageUrl.substring(imageUrl.lastIndexOf('.'));

            if (extension.matches("\\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)")) {
                return extension;
            } else {
                throw new IllegalArgumentException("Invalid image extension: " + extension);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract image extension from URL: " + url, e);
        }
    }
}