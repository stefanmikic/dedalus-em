package com.employeemanagerbe.department.dto;

import java.util.UUID;

public record DepartmentResponse(
        UUID id,
        String name
) {}

