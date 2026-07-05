package com.geeknito.geeknito_backend.config;

import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.exception.AccessDeniedException;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import com.geeknito.geeknito_backend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow preflight CORS request (OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String contextPath = request.getContextPath();
        String uri = request.getRequestURI();
        String path = uri;
        if (contextPath != null && uri.startsWith(contextPath)) {
            path = uri.substring(contextPath.length());
        }

        // Apply only to endpoints starting with "/admin"
        if (path.startsWith("/admin") || path.startsWith("/admin/")) {
            log.info("Security Interceptor: Authenticating request for path: {}", path);

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Security Interceptor: Missing or invalid Authorization header on: {}", path);
                throw new AuthenticationException("Missing or invalid authorization token. Access denied.");
            }

            String token = authHeader.substring(7).trim();
            // Expected token format: educorp-jwt-token-stub-<userId>
            String prefix = "educorp-jwt-token-stub-";
            if (!token.startsWith(prefix)) {
                log.warn("Security Interceptor: Invalid token prefix on: {}", path);
                throw new AuthenticationException("Invalid authentication token. Access denied.");
            }

            String userIdStr = token.substring(prefix.length()).trim();
            Long userId;
            try {
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                log.warn("Security Interceptor: Non-numeric user ID in token: {}", userIdStr);
                throw new AuthenticationException("Invalid token format. Access denied.");
            }

            Optional<UserEntity> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("Security Interceptor: User with ID {} not found in database", userId);
                throw new AuthenticationException("User does not exist. Access denied.");
            }

            UserEntity user = userOpt.get();
            if (!user.isActive()) {
                log.warn("Security Interceptor: User {} is deactivated", user.getEmail());
                throw new AccessDeniedException("This user account has been deactivated. Access denied.");
            }

            // Check if user is an administrator
            if (!"admin".equalsIgnoreCase(user.getRole())) {
                log.warn("Security Interceptor: Unauthorized access attempt by student {} to admin path: {}", user.getEmail(), path);
                throw new AccessDeniedException("Access denied. Admin privileges required.");
            }

            // Store the authenticated user in request scope for controller use if needed
            request.setAttribute("currentUser", user);
            log.debug("Security Interceptor: User {} authenticated successfully for: {}", user.getEmail(), path);
        }

        return true;
    }
}
