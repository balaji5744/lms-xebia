package com.geeknito.geeknito_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration.class,
    org.springframework.boot.autoconfigure.gson.GsonAutoConfiguration.class,
    org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration.class
})
@EnableCaching
public class GeeknitoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeeknitoBackendApplication.class, args);
    }
}
