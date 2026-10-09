package com.geeknito.geeknito_backend.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * HealthController
 * 
 * Provides an ultra-lightweight, zero-DB, zero-Redis ping endpoint
 * specifically designed for keep-alive monitoring (e.g. UptimeRobot)
 * on serverless and auto-sleeping platforms like Render Free Tier.
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthPing() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", Instant.now().toString()
        ));
    }
}
