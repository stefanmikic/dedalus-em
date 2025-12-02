import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { Department } from '../models/department.model';
import { Employee } from '../../employees/models/employee.model';
import { DepartmentService } from '../services/department.service';
import { EmployeeService } from '../../employees/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from '../../employees/dialogs/add-employee/add-employee-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeSearchComponent } from '../../employees/employee-search/em-employee-search.component';
import { EmployeeTableComponent } from "../../employees/employee-table/em-employee-table.component";

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    EmployeeSearchComponent,
    EmployeeTableComponent
],
  templateUrl: './department.html',
  styleUrls: ['./department.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  router = inject(Router);

  departmentId = '';
  department = signal<Department | null>(null);

  employees = signal<Employee[]>([]);
  searchResults = signal<Employee[]>([]);

  searchTerm = signal('');
  isLoading = signal(false);
  isUnassignedView = signal(false);
  errorMessage = signal<string | null>(null);

  displayedColumns = ['fullName', 'email', 'phoneNumber', 'actions'];

  constructor() {
    effect(() => {
      const term = this.searchTerm().trim();

      if (!term) {
        this.searchResults.set([]);
        return;
      }

      this.searchDepartmentEmployees(term);
    });
  }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.params['id'];

    if (this.departmentId === 'unassigned') {
      this.isUnassignedView.set(true);
      this.department.set({
        id: null,
        name: 'Unassigned',
      } as unknown as Department);
    } else {
      this.loadDepartment();
    }

    this.loadEmployees();
  }

  loadDepartment(): void {
    this.departmentService
      .getById(this.departmentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dept) => this.department.set(dept),
        error: () => this.errorMessage.set('Failed to load department information'),
      });
  }

  loadEmployees(): void {
    this.isLoading.set(true);

    if (this.isUnassignedView()) {
      this.employeeService
        .getUnassigned()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (employees) => {
            this.employees.set(employees);
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Failed to load employees');
            this.isLoading.set(false);
          },
        });
    } else {
      this.employeeService
        .getByDepartment(this.departmentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (employees) => {
            this.employees.set(employees);
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Failed to load employees');
            this.isLoading.set(false);
          },
        });
    }
  }

  private searchDepartmentEmployees(term: string) {
    this.isLoading.set(true);

    this.employeeService
      .searchByName(term)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employees) => {
          const filtered = this.isUnassignedView()
            ? employees.filter((e) => !e.departmentId)
            : employees.filter((e) => e.departmentId === this.departmentId);

          this.searchResults.set(filtered);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to search employees');
          this.isLoading.set(false);
        },
      });
  }

  isInSearchMode(): boolean {
    return this.searchTerm().trim().length > 0;
  }

  onEmployeeRowClick(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  onAddEmployee(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const payload = {
          ...result,
          departmentId: this.departmentId === 'unassigned' ? null : this.departmentId,
        };

        this.employeeService
          .create(payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.loadEmployees(),
            error: () => this.errorMessage.set('Failed to add employee'),
          });
      }
    });
  }

  onDeleteEmployee(emp: Employee): void {
    if (!confirm(`Delete employee "${emp.fullName}"?`)) return;

    this.isLoading.set(true);
    this.employeeService
      .delete(emp.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadEmployees(),
        error: () => {
          this.errorMessage.set('Failed to delete employee');
          this.isLoading.set(false);
        },
      });
  }
}
