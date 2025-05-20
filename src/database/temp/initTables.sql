-- Step 1: Insert clients
INSERT INTO clients (name, status, side_note)
VALUES 
    ('Client A', 'Active', 'Side note for Client A'),
    ('Client B', 'Inactive', 'Side note for Client B');

-- Step 2: Insert users
INSERT INTO users (username, display_name, email, password, role)
VALUES 
    ('user1', 'User 1', 'g8a7t@example.com', '$2b$10$8D9G2r3M0iKg7yT8g5yT8g5yT8g5yT8g5yT8g5yT8g5yT8g5yT8', 'admin'),
    ('user2', 'User 2', '7yT8g@example.com', '$2b$10$8D9G2r3M0iKg7yT8g5yT8g5yT8g5yT8g5yT8g5yT8g5yT8g5yT8', 'user');

-- Step 3: Insert services
INSERT INTO services (client_id, service_type, technology, speed, address, from_address, to_address, numberless_lines, phone_numbers, status)
VALUES 
    (1, 'Internet', 'wdm', '100Mbps', '123 Main St', NULL, NULL, NULL, NULL, 'active'),
    (1, 'Telephony', 'isdn', NULL, '456 Elm St', NULL, NULL, 4, ARRAY['123-456-7890', '987-654-3210'], 'paused');

-- Step 4: Insert contacts
INSERT INTO contacts (client_id, contact_type, contact_name, value)
VALUES 
    (1, 'Email', 'Support', 'support@a.com'),
    (1, 'Phone', 'Sales', '123-456-7890');

-- Step 5: Insert tickets
INSERT INTO tickets (client_id, title, description, priority, status, problem_type, assigned_user_id)
VALUES 
    (1, 'FIRST TICKET', 'FIRST TICKET', 'HIGH', 'OPEN', 'internet', 1),
    (1, 'SECOND TICKET', 'SECOND TICKET', 'HIGH', 'CLOSED', 'telephony' , 1),
    (1, 'THIRD TICKET', 'THIRD TICKET', 'LOW', 'CLOSED', 'telephony' , 1);

-- Step 6: Insert close_ticket_reports
INSERT INTO close_ticket_reports (ticket_id, close_report, close_reason, closed_by)
VALUES 
    (2, 'FIRST TICKET REPORT', 'Fixed', 'Viktor'),
    (3, 'SECOND TICKET REPORT', 'duplicate', 'Viktor');


