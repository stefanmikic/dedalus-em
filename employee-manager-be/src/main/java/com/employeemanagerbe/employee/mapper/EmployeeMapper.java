package com.employeemanagerbe.employee.mapper;

import com.employeemanagerbe.employee.dto.EmployeeCreateRequest;
import com.employeemanagerbe.employee.dto.EmployeeResponse;
import com.employeemanagerbe.employee.dto.EmployeeUpdateRequest;
import com.employeemanagerbe.department.entity.Department;
import com.employeemanagerbe.employee.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", source = "department")
    Employee toEntity(EmployeeCreateRequest request, Department department);

    @Mapping(target = "department", source = "department")
    void updateEmployeeFromDto(EmployeeUpdateRequest request,
                               @MappingTarget Employee employee,
                               Department department);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    EmployeeResponse toResponse(Employee employee);
}
