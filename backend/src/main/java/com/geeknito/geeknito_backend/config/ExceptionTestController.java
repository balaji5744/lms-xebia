package com.geeknito.geeknito_backend.config;

import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import com.geeknito.geeknito_backend.exception.AccessDeniedException;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test/exception")
@CrossOrigin(origins = "*")
public class ExceptionTestController {

    @GetMapping("/not-found")
    public void triggerNotFound() {
        throw new ResourceNotFoundException("Test Resource Not Found Exception triggered.");
    }

    @GetMapping("/illegal-argument")
    public void triggerIllegalArgument() {
        throw new IllegalArgumentException("Test Illegal Argument Exception: Invalid input value provided.");
    }

    @GetMapping("/access-denied")
    public void triggerAccessDenied() {
        throw new AccessDeniedException("Test Access Denied Exception: Insufficient user permissions.");
    }

    @GetMapping("/unauthorized")
    public void triggerUnauthorized() {
        throw new AuthenticationException("Test Authentication Exception: Missing or invalid credentials token.");
    }

    @GetMapping("/validation")
    public void triggerValidation() throws BindException {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "testObject");
        bindingResult.addError(new FieldError("testObject", "title", "Course title is required and cannot be empty"));
        bindingResult.addError(new FieldError("testObject", "slug", "URL slug is malformed or invalid"));
        throw new BindException(bindingResult);
    }

    @GetMapping("/unexpected")
    public void triggerUnexpected() {
        throw new NullPointerException("Test Null Pointer Exception: Unexpected server error occurred.");
    }
}
