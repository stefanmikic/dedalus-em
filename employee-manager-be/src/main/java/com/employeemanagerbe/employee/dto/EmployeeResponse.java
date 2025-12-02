package com.employeemanagerbe.employee.dto;

import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String fullName,
        String address,
        String phoneNumber,
        String email,
        UUID departmentId,
        String departmentName
){}

