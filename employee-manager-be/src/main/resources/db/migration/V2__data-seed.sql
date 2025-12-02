
INSERT INTO department (id, name)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Engineering'),
    ('22222222-2222-2222-2222-222222222222', 'Human Resources'),
    ('33333333-3333-3333-3333-333333333333', 'Finance')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO employee (id, full_name, address, phone_number, email, department_id)
VALUES
    ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Alice Johnson', '123 Maple Street', '555-1234', 'alice@example.com', '11111111-1111-1111-1111-111111111111'),
    ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Bob Smith', '456 Oak Avenue', '555-5678', 'bob@example.com', '22222222-2222-2222-2222-222222222222'),
    ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Charles Brown', '789 Pine Road', '555-8765', 'charles@example.com', '11111111-1111-1111-1111-111111111111'),
    ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Diana Adams', '101 Elm Blvd', '555-3456', 'diana@example.com', NULL), -- Unassigned
    ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Edward Wilson', '202 Birch Lane', '555-9876', 'edward@example.com', NULL) -- Unassigned
    ON CONFLICT (id) DO NOTHING;
