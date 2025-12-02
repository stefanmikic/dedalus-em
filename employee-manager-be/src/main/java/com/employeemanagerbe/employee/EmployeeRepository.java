package com.employeemanagerbe.employee;

import com.employeemanagerbe.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    boolean existsByEmailIgnoreCase(String email);

    List<Employee> findByDepartmentId(UUID departmentId);

    long countByDepartmentIsNull();

    List<Employee> findByFullNameContainingIgnoreCase(String fullName);

    List<Employee> findByDepartmentIsNull();

    @Query("""
    SELECT e
    FROM Employee e
    WHERE LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
      AND (:departmentId IS NULL OR e.department.id = :departmentId)
    """)
    List<Employee> search(
            @Param("query") String query,
            @Param("departmentId") UUID departmentId
    );
}

