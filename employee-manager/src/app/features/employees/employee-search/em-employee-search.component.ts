import {
  Component,
  ChangeDetectionStrategy,
  model,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'em-employee-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './em-employee-search.component.html',
  styleUrls: ['./em-employee-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeSearchComponent {

  model = model<string>('');

  search = output<string>();

  onInputChange(value: string) {
    this.model.set(value);
    this.search.emit(value);
  }

  clear() {
    this.model.set('');
    this.search.emit('');
  }
}
