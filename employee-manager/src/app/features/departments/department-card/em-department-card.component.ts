import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentSummary } from '../models/department-summary.model';

@Component({
  selector: 'em-department-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './em-department-card.component.html',
  styleUrls: ['./em-department-card.component.scss'],
})
export class DepartmentCardComponent {
  department = input.required<DepartmentSummary>();

  open = output<string | null>();
  delete = output<DepartmentSummary>();

  onCardClick(): void {
    this.open.emit(this.department().id ?? null);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.department());
  }
}
