package com.employeemanagerbe.department;

import com.employeemanagerbe.department.dto.DepartmentCreateRequest;
import com.employeemanagerbe.department.dto.DepartmentResponse;
import com.employeemanagerbe.department.dto.DepartmentSummaryResponse;
import com.employeemanagerbe.department.dto.DepartmentUpdateRequest;
import com.employeemanagerbe.department.mapper.DepartmentMapper;
import com.employeemanagerbe.common.exception.EMCustomException;
import com.employeemanagerbe.department.entity.Department;
import com.employeemanagerbe.employee.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentMapper departmentMapper;

    @Transactional
    public DepartmentResponse create(DepartmentCreateRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.name())) {
            throw new EMCustomException("Department name already in use: " + request.name());
        }

        Department department = departmentMapper.toEntity(request);
        Department saved = departmentRepository.save(department);
        return departmentMapper.toResponse(saved);
    }

    @Transactional
    public DepartmentResponse update(UUID id, DepartmentUpdateRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + id));

        if (!department.getName().equalsIgnoreCase(request.name())
                && departmentRepository.existsByNameIgnoreCase(request.name())) {
            throw new EMCustomException("Department name already in use: " + request.name());
        }

        departmentMapper.updateDepartmentFromDto(request, department);
        Department saved = departmentRepository.save(department);
        return departmentMapper.toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + id));

        departmentRepository.delete(department);
    }


    @Transactional(readOnly = true)
    public DepartmentResponse getById(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + id));

        return departmentMapper.toResponse(department);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DepartmentSummaryResponse> getSummary() {

        List<DepartmentSummaryResponse> result = departmentRepository.getDepartmentSummary();

        long unassignedCount = employeeRepository.countByDepartmentIsNull();

        if (unassignedCount > 0) {
            result.add(new DepartmentSummaryResponse(null, "Unassigned", unassignedCount));
        }

        return result;
    }


}

