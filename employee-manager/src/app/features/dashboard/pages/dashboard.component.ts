import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { DepartmentSummary } from '../../departments/models/department-summary.model';
import { Employee } from '../../employees/models/employee.model';
import { EmployeeService } from '../../employees/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentCardComponent } from '../../departments/department-card/em-department-card.component';
import { AddDepartmentDialogComponent } from '../../departments/dialogs/add-department/add-department-dialog.component';
import { DepartmentService } from '../../departments/services/department.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeSearchComponent } from "../../employees/employee-search/em-employee-search.component";
import { EmployeeTableComponent } from "../../employees/employee-table/em-employee-table.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    DepartmentCardComponent,
    EmployeeSearchComponent,
    EmployeeTableComponent
],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  searchTerm = signal('');

  departments = signal<DepartmentSummary[]>([]);
  searchResults = signal<Employee[]>([]);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  displayedColumns = ['fullName', 'department', 'email', 'phoneNumber'];

  ngOnInit(): void {
    this.loadDepartmentSummary();
  }

  loadDepartmentSummary(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.departmentService
      .getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (departments) => {
          this.departments.set(departments);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load departments.');
          this.isLoading.set(false);
        },
      });
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);

    const term = value.trim();

    if (!term) {
      this.searchResults.set([]);

      if (this.departments().length === 0) {
        this.loadDepartmentSummary();
      }
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.employeeService
      .searchByName(term)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employees) => {
          this.searchResults.set(employees);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to search employees.');
          this.isLoading.set(false);
        },
      });
  }

  isInSearchMode(): boolean {
    return this.searchTerm().trim().length > 0;
  }

  openDepartment(departmentId: string | null): void {
    if (!departmentId) {
      this.router.navigate(['/departments', 'unassigned']);
      return;
    }

    this.router.navigate(['/departments', departmentId]);
  }

  onAddDepartment(): void {
    const dialogRef = this.dialog.open(AddDepartmentDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.loadDepartmentSummary();
        }
      });
  }

  onDeleteDepartment(department: DepartmentSummary): void {
    if (!department.id) return;

    if (!confirm(`Delete department "${department.name}"? Employees will become Unassigned.`)) {
      return;
    }

    this.isLoading.set(true);

    this.departmentService
      .delete(department.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadDepartmentSummary(),
        error: () => {
          this.errorMessage.set('Failed to delete department.');
          this.isLoading.set(false);
        },
      });
  }

  onEmployeeRowClick(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }
}
