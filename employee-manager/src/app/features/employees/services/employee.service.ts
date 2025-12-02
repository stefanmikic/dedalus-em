import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../../../environments/environment';
import { CreateEmployeeRequest } from '../models/create-employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/employees`;

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getByDepartment(departmentId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl, {
      params: { departmentId },
    });
  }

  searchByName(name: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl, {
      params: { name },
    });
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getUnassigned() {
    return this.http.get<Employee[]>(`${this.baseUrl}/unassigned`);
  }
}
