import { Employee } from "./employee.model";

export type CreateEmployeeRequest = Omit<Employee, 'id' | 'departmentName'>;
