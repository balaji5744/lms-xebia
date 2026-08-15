package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.course.dto.ContentRequestDTO;
import com.geeknito.geeknito_backend.course.dto.ContentResponseDTO;
import com.geeknito.geeknito_backend.course.repository.ContentRepository;
import com.geeknito.geeknito_backend.course.repository.SubmoduleRepository;
import com.geeknito.geeknito_backend.entity.learning.ContentEntity;
import com.geeknito.geeknito_backend.entity.learning.SubmoduleEntity;
import com.geeknito.geeknito_backend.coding.repository.CodingProblemRepository;
import com.geeknito.geeknito_backend.coding.repository.TestCaseRepository;
import com.geeknito.geeknito_backend.coding.repository.StarterCodeRepository;
import com.geeknito.geeknito_backend.entity.learning.CodingProblemEntity;
import com.geeknito.geeknito_backend.entity.learning.TestCaseEntity;
import com.geeknito.geeknito_backend.entity.learning.StarterCodeEntity;
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
    private final CodingProblemRepository codingProblemRepository;
    private final TestCaseRepository testCaseRepository;
    private final StarterCodeRepository starterCodeRepository;

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
                .alt(dto.getAlt())
                .caption(dto.getCaption())
                .headingLevel(dto.getHeadingLevel())
                .contentOrder(dto.getContentOrder())
                .submodule(submodule)
                .isActive(true)
                .build();

        ContentEntity saved = contentRepository.save(content);

        if ("coding_assignment".equals(dto.getType()) && dto.getCodingProblem() != null) {
            saveCodingProblem(saved, dto.getCodingProblem());
        }

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
        content.setAlt(dto.getAlt());
        content.setCaption(dto.getCaption());
        content.setHeadingLevel(dto.getHeadingLevel());
        content.setContentOrder(dto.getContentOrder());

        ContentEntity updated = contentRepository.save(content);

        if ("coding_assignment".equals(dto.getType()) && dto.getCodingProblem() != null) {
            CodingProblemEntity existingProblem = codingProblemRepository.findByContentId(contentId).orElse(null);
            if (existingProblem == null) {
                saveCodingProblem(updated, dto.getCodingProblem());
            } else {
                existingProblem.setSlug(dto.getCodingProblem().getSlug());
                existingProblem.setDescription(dto.getCodingProblem().getDescription());
                existingProblem.setInputFormat(dto.getCodingProblem().getInputFormat());
                existingProblem.setOutputFormat(dto.getCodingProblem().getOutputFormat());
                existingProblem.setConstraints(dto.getCodingProblem().getConstraints());
                existingProblem.setExplanation(dto.getCodingProblem().getExplanation());
                existingProblem.setDifficulty(dto.getCodingProblem().getDifficulty());
                existingProblem.setPoints(dto.getCodingProblem().getPoints());
                existingProblem.setTimeLimit(dto.getCodingProblem().getTimeLimit());
                existingProblem.setMemoryLimit(dto.getCodingProblem().getMemoryLimit());
                CodingProblemEntity savedProblem = codingProblemRepository.save(existingProblem);

                List<TestCaseEntity> oldTcs = testCaseRepository.findByProblemIdOrderByTestOrderAsc(savedProblem.getId());
                testCaseRepository.deleteAll(oldTcs);
                if (dto.getCodingProblem().getTestCases() != null) {
                    List<TestCaseEntity> newTcs = dto.getCodingProblem().getTestCases().stream()
                        .map(tc -> TestCaseEntity.builder()
                            .problem(savedProblem)
                            .input(tc.getInput())
                            .expectedOutput(tc.getExpectedOutput())
                            .isHidden(tc.isHidden())
                            .points(tc.getPoints())
                            .testOrder(tc.getTestOrder())
                            .build())
                        .collect(Collectors.toList());
                    testCaseRepository.saveAll(newTcs);
                }

                List<StarterCodeEntity> oldScs = starterCodeRepository.findByProblemId(savedProblem.getId());
                starterCodeRepository.deleteAll(oldScs);
                if (dto.getCodingProblem().getStarterCodes() != null) {
                    List<StarterCodeEntity> newScs = dto.getCodingProblem().getStarterCodes().stream()
                        .map(sc -> StarterCodeEntity.builder()
                            .problem(savedProblem)
                            .language(sc.getLanguage())
                            .code(sc.getCode())
                            .build())
                        .collect(Collectors.toList());
                    starterCodeRepository.saveAll(newScs);
                }
            }
        }

        return mapToResponse(updated);
    }

    private void saveCodingProblem(ContentEntity content, com.geeknito.geeknito_backend.coding.dto.CodingProblemRequestDTO dto) {
        CodingProblemEntity problem = CodingProblemEntity.builder()
                .content(content)
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .inputFormat(dto.getInputFormat())
                .outputFormat(dto.getOutputFormat())
                .constraints(dto.getConstraints())
                .explanation(dto.getExplanation())
                .difficulty(dto.getDifficulty())
                .points(dto.getPoints())
                .timeLimit(dto.getTimeLimit())
                .memoryLimit(dto.getMemoryLimit())
                .isActive(true)
                .build();

        CodingProblemEntity savedProblem = codingProblemRepository.save(problem);

        if (dto.getTestCases() != null) {
            List<TestCaseEntity> tcs = dto.getTestCases().stream()
                .map(tc -> TestCaseEntity.builder()
                    .problem(savedProblem)
                    .input(tc.getInput())
                    .expectedOutput(tc.getExpectedOutput())
                    .isHidden(tc.isHidden())
                    .points(tc.getPoints())
                    .testOrder(tc.getTestOrder())
                    .build())
                .collect(Collectors.toList());
            testCaseRepository.saveAll(tcs);
        }

        if (dto.getStarterCodes() != null) {
            List<StarterCodeEntity> scs = dto.getStarterCodes().stream()
                .map(sc -> StarterCodeEntity.builder()
                    .problem(savedProblem)
                    .language(sc.getLanguage())
                    .code(sc.getCode())
                    .build())
                .collect(Collectors.toList());
            starterCodeRepository.saveAll(scs);
        }
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

        ContentResponseDTO.ContentResponseDTOBuilder builder = ContentResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .type(entity.getType())
                .text(entity.getText())
                .code(entity.getCode())
                .language(entity.getLanguage())
                .videoUrl(entity.getVideoUrl())
                .imageUrl(entity.getImageUrl())
                .alt(entity.getAlt())
                .caption(entity.getCaption())
                .headingLevel(entity.getHeadingLevel())
                .contentOrder(entity.getContentOrder())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt());

        if ("coding_assignment".equals(entity.getType()) && entity.getCodingProblem() != null) {
            builder.codingProblem(mapProblemToResponse(entity.getCodingProblem()));
        }

        return builder.build();
    }

    private com.geeknito.geeknito_backend.coding.dto.CodingProblemResponseDTO mapProblemToResponse(CodingProblemEntity problem) {
        if (problem == null) return null;

        List<com.geeknito.geeknito_backend.coding.dto.TestCaseResponseDTO> tcs = null;
        if (problem.getTestCases() != null) {
            tcs = problem.getTestCases().stream()
                .map(tc -> com.geeknito.geeknito_backend.coding.dto.TestCaseResponseDTO.builder()
                    .id(tc.getId())
                    .input(tc.getInput())
                    .expectedOutput(tc.getExpectedOutput())
                    .isHidden(tc.isHidden())
                    .points(tc.getPoints())
                    .testOrder(tc.getTestOrder())
                    .build())
                .collect(Collectors.toList());
        }

        List<com.geeknito.geeknito_backend.coding.dto.StarterCodeResponseDTO> scs = null;
        if (problem.getStarterCodes() != null) {
            scs = problem.getStarterCodes().stream()
                .map(sc -> com.geeknito.geeknito_backend.coding.dto.StarterCodeResponseDTO.builder()
                    .id(sc.getId())
                    .language(sc.getLanguage())
                    .code(sc.getCode())
                    .build())
                .collect(Collectors.toList());
        }

        return com.geeknito.geeknito_backend.coding.dto.CodingProblemResponseDTO.builder()
            .id(problem.getId())
            .slug(problem.getSlug())
            .description(problem.getDescription())
            .inputFormat(problem.getInputFormat())
            .outputFormat(problem.getOutputFormat())
            .constraints(problem.getConstraints())
            .explanation(problem.getExplanation())
            .difficulty(problem.getDifficulty())
            .points(problem.getPoints())
            .timeLimit(problem.getTimeLimit())
            .memoryLimit(problem.getMemoryLimit())
            .testCases(tcs)
            .starterCodes(scs)
            .createdAt(problem.getCreatedAt())
            .updatedAt(problem.getUpdatedAt())
            .build();
    }
}
