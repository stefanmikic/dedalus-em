import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-add-department-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-department-dialog.html',
  styleUrls: ['./add-department-dialog.scss'],
})
export class AddDepartmentDialogComponent {
  private departmentService = inject(DepartmentService);
  private dialogRef = inject(MatDialogRef<AddDepartmentDialogComponent>);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true
    })
  });

  submit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const name = this.form.value.name!;

    this.departmentService.create({ name }).subscribe({
      next: dept => {
        this.isSubmitting.set(false);
        this.dialogRef.close(dept);
      },
      error: () => {
        this.errorMessage.set('Failed to create department.');
        this.isSubmitting.set(false);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
