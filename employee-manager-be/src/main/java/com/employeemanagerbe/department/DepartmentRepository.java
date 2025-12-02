package com.employeemanagerbe.department;

import com.employeemanagerbe.department.dto.DepartmentSummaryResponse;
import com.employeemanagerbe.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    boolean existsByNameIgnoreCase(String name);

    @Query("""
        SELECT new com.employeemanagerbe.department.dto.DepartmentSummaryResponse(
            d.id,
            d.name,
            COUNT(e.id)
        )
        FROM Department d
        LEFT JOIN Employee e ON e.department.id = d.id
        GROUP BY d.id, d.name
        ORDER BY d.name
    """)
    List<DepartmentSummaryResponse> getDepartmentSummary();
}
