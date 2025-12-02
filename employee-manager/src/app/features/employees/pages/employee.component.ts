import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.scss'],
})
export class EmployeeComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  employeeId = '';
  employee = signal<Employee | null>(null);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading.set(true);

    this.employeeService
      .getById(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (emp) => {
          this.employee.set(emp);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load employee');
          this.isLoading.set(false);
        },
      });
  }

  goToDepartment(): void {
    const emp = this.employee();
    if (emp?.departmentId) {
      this.router.navigate(['/departments', emp.departmentId]);
    }
  }

  deleteEmployee(): void {
    const emp = this.employee();
    if (!emp) return;

    if (!confirm(`Delete employee "${emp.fullName}"?`)) return;

    this.isLoading.set(true);

    this.employeeService
      .delete(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          this.errorMessage.set('Failed to delete employee');
          this.isLoading.set(false);
        },
      });
  }
}
