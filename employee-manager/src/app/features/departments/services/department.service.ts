import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentSummary } from '../models/department-summary.model';
import { Department } from '../models/department.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/departments`;

  getSummary(): Observable<DepartmentSummary[]> {
    return this.http.get<DepartmentSummary[]>(`${this.baseUrl}/summary`);
  }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  create(request: { name: string }) {
    return this.http.post<Department>(this.baseUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
