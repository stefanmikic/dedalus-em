package com.employeemanagerbe.employee;

import com.employeemanagerbe.employee.dto.EmployeeCreateRequest;
import com.employeemanagerbe.employee.dto.EmployeeResponse;
import com.employeemanagerbe.employee.dto.EmployeeUpdateRequest;
import com.employeemanagerbe.employee.mapper.EmployeeMapper;
import com.employeemanagerbe.common.exception.EMCustomException;
import com.employeemanagerbe.department.entity.Department;
import com.employeemanagerbe.department.DepartmentRepository;
import com.employeemanagerbe.employee.entity.Employee;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    @Transactional
    public EmployeeResponse create(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmailIgnoreCase(request.email())) {
            throw new EMCustomException("Email already in use: " + request.email());
        }

        Department department = null;

        if(Objects.nonNull(request.departmentId())) {
            department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found: " + request.departmentId()));
        }

        Employee employee = employeeMapper.toEntity(request, department);
        Employee saved = employeeRepository.save(employee);
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    public EmployeeResponse update(UUID id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        if (!employee.getEmail().equalsIgnoreCase(request.email())
                && employeeRepository.existsByEmailIgnoreCase(request.email())) {
            throw new EMCustomException("Email already in use: " + request.email());
        }

        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + request.departmentId()));

        employeeMapper.updateEmployeeFromDto(request, employee, department);
        Employee saved = employeeRepository.save(employee);
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        employeeRepository.delete(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        return employeeMapper.toResponse(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getByDepartment(UUID departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(employeeMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> searchByName(String name) {
        return employeeRepository.findByFullNameContainingIgnoreCase(name)
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getUnassigned() {
        return employeeRepository.findByDepartmentIsNull()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }
}

