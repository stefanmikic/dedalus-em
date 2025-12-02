package com.employeemanagerbe.department.dto;

import java.util.UUID;

public record DepartmentSummaryResponse(
        UUID id,
        String name,
        long employeeCount
) {}

