import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard.component')
        .then(m => m.DashboardComponent),
  },
  {
    path: 'departments/:id',
    loadComponent: () =>
      import('./features/departments/pages/department.component')
        .then(m => m.DepartmentComponent),
  },
  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./features/employees/pages/employee.component')
        .then(m => m.EmployeeComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
