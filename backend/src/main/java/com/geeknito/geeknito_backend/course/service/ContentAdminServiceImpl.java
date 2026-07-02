package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.course.dto.ContentRequestDTO;
import com.geeknito.geeknito_backend.course.dto.ContentResponseDTO;
import com.geeknito.geeknito_backend.course.repository.ContentRepository;
import com.geeknito.geeknito_backend.course.repository.SubmoduleRepository;
import com.geeknito.geeknito_backend.entity.learning.ContentEntity;
import com.geeknito.geeknito_backend.entity.learning.SubmoduleEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentAdminServiceImpl implements ContentAdminService {

    private final ContentRepository contentRepository;
    private final SubmoduleRepository submoduleRepository;

    @Override
    @Transactional
    public ContentResponseDTO createContent(Long submoduleId, ContentRequestDTO dto) {
        SubmoduleEntity submodule = submoduleRepository.findById(submoduleId)
                .orElseThrow(() -> new EntityNotFoundException("Submodule not found with ID: " + submoduleId));

        ContentEntity content = ContentEntity.builder()
                .title(dto.getTitle())
                .type(dto.getType())
                .text(dto.getText())
                .code(dto.getCode())
                .language(dto.getLanguage())
                .videoUrl(dto.getVideoUrl())
                .imageUrl(dto.getImageUrl())
                .fileUrl(dto.getFileUrl())
                .fileName(dto.getFileName())
                .alt(dto.getAlt())
                .caption(dto.getCaption())
                .headingLevel(dto.getHeadingLevel())
                .contentOrder(dto.getContentOrder())
                .submodule(submodule)
                .isActive(true)
                .build();

        ContentEntity saved = contentRepository.save(content);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ContentResponseDTO updateContent(Long contentId, ContentRequestDTO dto) {
        ContentEntity content = contentRepository.findById(contentId)
                .orElseThrow(() -> new EntityNotFoundException("Content not found with ID: " + contentId));

        content.setTitle(dto.getTitle());
        content.setType(dto.getType());
        content.setText(dto.getText());
        content.setCode(dto.getCode());
        content.setLanguage(dto.getLanguage());
        content.setVideoUrl(dto.getVideoUrl());
        content.setImageUrl(dto.getImageUrl());
        content.setFileUrl(dto.getFileUrl());
        content.setFileName(dto.getFileName());
        content.setAlt(dto.getAlt());
        content.setCaption(dto.getCaption());
        content.setHeadingLevel(dto.getHeadingLevel());
        content.setContentOrder(dto.getContentOrder());

        ContentEntity updated = contentRepository.save(content);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteContent(Long contentId) {
        ContentEntity content = contentRepository.findById(contentId)
                .orElseThrow(() -> new EntityNotFoundException("Content not found with ID: " + contentId));

        content.setActive(false);
        contentRepository.save(content);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponseDTO> getContentBySubmodule(Long submoduleId) {
        if (!submoduleRepository.existsById(submoduleId)) {
            throw new EntityNotFoundException("Submodule not found with ID: " + submoduleId);
        }

        List<ContentEntity> contents = contentRepository.findBySubmoduleIdOrderByContentOrderAsc(submoduleId);
        return contents.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ContentResponseDTO mapToResponse(ContentEntity entity) {
        if (entity == null) {
            return null;
        }

        return ContentResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .type(entity.getType())
                .text(entity.getText())
                .code(entity.getCode())
                .language(entity.getLanguage())
                .videoUrl(entity.getVideoUrl())
                .imageUrl(entity.getImageUrl())
                .fileUrl(entity.getFileUrl())
                .fileName(entity.getFileName())
                .alt(entity.getAlt())
                .caption(entity.getCaption())
                .headingLevel(entity.getHeadingLevel())
                .contentOrder(entity.getContentOrder())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}