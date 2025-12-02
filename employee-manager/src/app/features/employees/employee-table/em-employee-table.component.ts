import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Employee } from '../models/employee.model';

@Component({
  selector: 'em-employee-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './em-employee-table.component.html',
  styleUrls: ['./em-employee-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeTableComponent {

  employees = input.required<Employee[]>();
  showActions = input(false);
  showDepartment = input(false);

  rowClick = output<Employee>();
  delete = output<Employee>();

  displayedColumns = computed(() => {
    const cols = ['fullName', 'email', 'phoneNumber'];

    if (this.showDepartment()) cols.push('department');
    if (this.showActions()) cols.push('actions');

    return cols;
  });
}
