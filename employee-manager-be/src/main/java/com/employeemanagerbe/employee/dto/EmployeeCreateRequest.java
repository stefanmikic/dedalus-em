package com.employeemanagerbe.employee.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record EmployeeCreateRequest(

        @NotBlank
        @Size(max = 150)
        String fullName,

        @NotBlank
        @Size(max = 255)
        String address,

        @NotBlank
        @Size(max = 50)
        String phoneNumber,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,

        UUID departmentId
) {}

