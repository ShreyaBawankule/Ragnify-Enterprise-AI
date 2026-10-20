CREATE TABLE managers (
  manager_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(80),
  experience VARCHAR(40)
);

CREATE TABLE employees (
  employee_id VARCHAR(10) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  gender VARCHAR(20),
  date_of_birth DATE,
  joining_date DATE,
  department VARCHAR(80),
  designation VARCHAR(100),
  manager_id VARCHAR(10) NOT NULL,
  experience VARCHAR(40),
  skills TEXT,
  salary_demo INTEGER,
  employment_status VARCHAR(30),
  FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
);

CREATE TABLE tasks (
  task_id VARCHAR(10) PRIMARY KEY,
  task_title VARCHAR(180) NOT NULL,
  description TEXT,
  assigned_employee_id VARCHAR(10) NOT NULL,
  assigned_manager_id VARCHAR(10) NOT NULL,
  priority VARCHAR(20),
  status VARCHAR(30),
  created_date DATE,
  start_date DATE,
  deadline DATE,
  completion_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  FOREIGN KEY (assigned_employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (assigned_manager_id) REFERENCES managers(manager_id)
);

CREATE TABLE meetings (
  meeting_id VARCHAR(10) PRIMARY KEY,
  meeting_title VARCHAR(180) NOT NULL,
  meeting_date DATE,
  duration VARCHAR(40),
  organizer VARCHAR(100),
  participants TEXT,
  agenda TEXT,
  decisions TEXT,
  action_items TEXT
);

CREATE TABLE dashboard_metrics (
  employee_id VARCHAR(10) PRIMARY KEY,
  employee_name VARCHAR(100),
  department VARCHAR(80),
  total_tasks INTEGER,
  completed_tasks INTEGER,
  pending_tasks INTEGER,
  in_progress_tasks INTEGER,
  overdue_tasks INTEGER,
  task_completion_rate DECIMAL(5,2),
  employee_productivity DECIMAL(5,2),
  estimated_hours INTEGER,
  actual_hours INTEGER,
  monthly_performance DECIMAL(5,2),
  weekly_performance DECIMAL(5,2),
  department_performance DECIMAL(5,2),
  top_performer VARCHAR(100),
  lowest_performer VARCHAR(100),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
