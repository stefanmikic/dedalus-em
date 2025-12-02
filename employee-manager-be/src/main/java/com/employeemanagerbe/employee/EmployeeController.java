package com.employeemanagerbe.employee;

import com.employeemanagerbe.employee.dto.EmployeeCreateRequest;
import com.employeemanagerbe.employee.dto.EmployeeResponse;
import com.employeemanagerbe.employee.dto.EmployeeUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(@Valid @RequestBody EmployeeCreateRequest request) {
        return employeeService.create(request);
    }

    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable UUID id) {
        return employeeService.getById(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeUpdateRequest request
    ) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        employeeService.delete(id);
    }

    @GetMapping
    public List<EmployeeResponse> getAllOrSearch(
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) String name
    ) {
        if (name != null && !name.isBlank()) {
            return employeeService.searchByName(name);
        }

        if (departmentId != null) {
            return employeeService.getByDepartment(departmentId);
        }

        return employeeService.getAll();
    }

    @GetMapping("/unassigned")
    public List<EmployeeResponse> getUnassignedEmployees() {
        return employeeService.getUnassigned();
    }

}

