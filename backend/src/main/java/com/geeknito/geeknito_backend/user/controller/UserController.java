package com.geeknito.geeknito_backend.user.controller;

import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.exception.AccessDeniedException;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import com.geeknito.geeknito_backend.user.dto.UserResponseDTO;
import com.geeknito.geeknito_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final UserRepository userRepository;

    private UserEntity getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationException("Full authentication is required to access this resource.");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            return (UserEntity) principal;
        }
        throw new AuthenticationException("User session is invalid or expired.");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        UserEntity u = getAuthenticatedUser();
        UserResponseDTO response = UserResponseDTO.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole())
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getUsers(@RequestParam(required = false) String role) {
        // Authenticate user
        UserEntity currentUser = getAuthenticatedUser();

        // Enforce RBAC
        String userRole = currentUser.getRole().toUpperCase();
        if ("STUDENT".equals(userRole)) {
            throw new AccessDeniedException("Students are not allowed to list users.");
        } else if ("TEACHER".equals(userRole)) {
            if (role == null || role.trim().isEmpty()) {
                throw new AccessDeniedException("Teachers must filter users by role.");
            }
            String filteredRole = role.trim().toUpperCase();
            if (!"STUDENT".equals(filteredRole) && !"TEACHER".equals(filteredRole)) {
                throw new AccessDeniedException("Teachers are only allowed to fetch STUDENT or TEACHER users.");
            }
        } else if (!"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("Access denied.");
        }

        log.info("Fetching users with role: {}", role);
        List<UserEntity> users;
        if (role != null && !role.trim().isEmpty()) {
            users = userRepository.findByRoleIgnoreCase(role.trim());
        } else {
            users = userRepository.findAll();
        }

        List<UserResponseDTO> response = users.stream()
                .map(u -> UserResponseDTO.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .isActive(u.isActive())
                        .createdAt(u.getCreatedAt())
                        .updatedAt(u.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
