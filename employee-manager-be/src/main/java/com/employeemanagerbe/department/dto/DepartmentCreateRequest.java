package com.employeemanagerbe.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentCreateRequest(
        @NotBlank
        @Size(max = 100)
        String name
) {}
