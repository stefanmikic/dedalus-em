CREATE SCHEMA IF NOT EXISTS company;
SET
search_path TO company;

CREATE TABLE department
(
    id   UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE employee
(
    id            UUID PRIMARY KEY,
    full_name     VARCHAR(150) NOT NULL,
    address       VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(50)  NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    department_id UUID,

    CONSTRAINT fk_employee_department
        FOREIGN KEY (department_id) REFERENCES department (id)
            ON DELETE SET NULL
);

CREATE UNIQUE INDEX department_name_ci_idx
    ON department (LOWER(name));

CREATE UNIQUE INDEX employee_email_ci_idx
    ON employee (LOWER(email));

CREATE INDEX employee_department_idx
    ON employee (department_id);
