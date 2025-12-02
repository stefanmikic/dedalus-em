package com.employeemanagerbe.department.mapper;

import com.employeemanagerbe.department.dto.DepartmentCreateRequest;
import com.employeemanagerbe.department.dto.DepartmentResponse;
import com.employeemanagerbe.department.dto.DepartmentUpdateRequest;
import com.employeemanagerbe.department.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    Department toEntity(DepartmentCreateRequest request);

    void updateDepartmentFromDto(DepartmentUpdateRequest request,
                                 @MappingTarget Department department);

    DepartmentResponse toResponse(Department department);
}

