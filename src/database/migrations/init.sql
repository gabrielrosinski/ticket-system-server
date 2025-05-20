ALTER DATABASE pdb1 SET TIMEZONE TO 'Europe/Kyiv';

DO $$  
DECLARE  
    r RECORD; 
BEGIN  
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')  
    LOOP  
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; 
    END LOOP;  
END $$; 
  

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(255) NOT NULL,
    side_note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON UPDATE CASCADE ON DELETE CASCADE,
    service_type VARCHAR(50),
    technology VARCHAR(50),
    speed VARCHAR(50),
    address VARCHAR(255),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    numberless_lines VARCHAR(255),
    phone_numbers TEXT[],
    status TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON UPDATE CASCADE ON DELETE CASCADE,
    contact_type VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    problem_type VARCHAR(255) NOT NULL,
    assigned_user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS close_ticket_reports (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE UNIQUE NOT NULL,
    close_report TEXT NOT NULL,
    close_reason TEXT NOT NULL,
    closed_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);