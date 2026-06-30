package com.geeknito.geeknito_backend.course.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Create the uploads folder if it doesn't exist
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 2. Generate a unique file name so uploads don't overwrite each other
            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);

            // 3. Save the file to the local folder
            Files.write(filePath, file.getBytes());

            // 4. Return the local download URL to the React frontend
            String fileDownloadUrl = "http://localhost:8080/uploads/" + uniqueFileName;
            log.info("File saved locally at: {}", fileDownloadUrl);

            return ResponseEntity.ok(Map.of("url", fileDownloadUrl, "fileName", originalFileName));

        } catch (IOException e) {
            log.error("Failed to store file", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file"));
        }
    }
}