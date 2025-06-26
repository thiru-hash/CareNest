
# CareNest Companion - B2B SaaS for Care Organizations

Welcome to the CareNest Companion application documentation. This document provides a comprehensive overview of the project's architecture, core features, and underlying logic.

## 1. Project Overview

CareNest Companion is a modern, role-based B2B SaaS platform designed to meet the complex operational needs of care organizations. It provides a centralized system for managing staff, clients (People We Support), rostering, finance, and compliance. The application is built with a focus on security, flexibility, and a clean user experience.

The core design philosophy is to provide administrators with powerful tools to customize the application's structure and permissions, while ensuring that staff members have a simple, intuitive interface that gives them access only to the information they need to perform their duties.

## 2. Core Concepts & Logic

### 2.1. Authentication & User Roles

- **Simulated Login**: The initial login page (`src/app/page.tsx`) simulates logging in as different user roles (e.g., System Admin, Support Worker). It works by setting a `currentUser_id` cookie, which is then used by the server to identify the user.
- **`getCurrentUser()`**: This server-side function in `src/lib/auth.ts` is the source of truth for identifying the logged-in user. It reads the cookie and retrieves the corresponding staff record from the mock data.
- **User Roles**: The system is built around a set of predefined roles (defined in `src/lib/roles.ts` and `src/lib/types.ts`), including `System Admin`, `CEO`, `Finance Admin`, `Human Resources Manager`, and `Support Worker`. These roles are fundamental to the permission system.

### 2.2. Permissions & Access Control

Access to data and features is governed by a sophisticated, multi-layered permission system.

1.  **Group-Based Rights (The Foundation)**
    -   **What it is**: The core permission model. Every user is assigned to one or more **Groups** (`System Settings > Groups`).
    -   **How it works**: Each Group is granted specific rights (View, Create, Edit, Delete) for each **Section** of the application (e.g., Roster, People, Finance). This is configured in `System Settings > Rights`.
    -   **Example**: The "Finance Admin" group might have full rights to the "Finance" section but only view rights for the "Staff" section.

2.  **Location-Based Access (Staff & Managers)**
    -   **What it is**: Controls which clients a staff member can see.
    -   **How it works**: In `System Settings > Users`, administrators can assign staff members to specific "Areas" (i.e., `Property` locations). The logic in `src/lib/access-control.ts` then ensures that these users can only see and interact with clients who reside at their assigned locations. This is a persistent assignment, suitable for managers or coordinators.

3.  **Dynamic Shift-Based Access (Support Workers)**
    -   **What it is**: A highly dynamic and secure access model for frontline staff.
    -   **How it works**: For users in the `Support Worker` role, their access to locations and clients is determined *in real-time* by their **active shifts** in the roster. They can only see information relevant to the shift they are currently working. Access is automatically granted when a shift starts and revoked when it ends. This ensures compliance with data privacy principles.

### 2.3. Data Model & Configuration

The application is heavily data-driven, using a mock data source in `src/lib/data.ts`. This file is crucial as it defines not only the sample data but also the relationships between different entities (Staff, Clients, Properties, Shifts, etc.). The system is designed so that replacing this file with a real database connection would be a straightforward next step.

## 3. Feature Breakdown

### 3.1. Dashboard (`/dashboard`)
- A role-based landing page that presents relevant information to the logged-in user.
- **Finance Overview**: A high-level summary of key financial metrics. This widget is strictly limited to users with the `Finance Admin` and `CEO` roles.
- **Upcoming Shifts**: Shows the user their upcoming assigned shifts as well as open shifts they can request.
- **Compliance Renewals**: Intelligently displays compliance items needing attention. HR and Admin roles see organization-wide renewals, while other staff only see their own.

### 3.2. Roster Schedule (`/roster`)
- A powerful, interactive calendar for managing staff shifts.
- **Conflict Detection**: The system automatically prevents the creation or saving of overlapping shifts for the same staff member, showing a descriptive error toast to the user.
- **Dual Views**: Can be toggled between a "Staff View" (rows are staff members) and a "Client View" (rows are clients) for different scheduling perspectives.
- **Dynamic Creation**: Admins can click on any empty cell to quickly create a new shift, pre-filled with the relevant staff/client and date.

### 3.3. Timesheet Management
- **Clock-Out to Timesheet Workflow**: When a staff member clocks out of a shift, a **Timesheet Dialog** automatically appears.
- **Rich Data Capture**: The dialog allows users to confirm shift times, log break durations, and add detailed **Travel Logs** for reimbursement. This ensures all relevant payroll data is captured accurately at the end of each shift.

### 3.4. People & Staff Management
- **Client Profiles (`/people/[id]`)**: A tab-based view of a client's information. The tabs and the forms within them are dynamically generated based on the configuration in `System Settings`, allowing admins to easily customize the client profile layout.
- **Staff Profiles (`/staff/[id]`)**: Displays staff information with granular, role-based visibility. For example, the `Finance Admin` can see salary details, while the `Human Resources Manager` can see HR notes and documents, and the staff member themselves can only see their basic info.
- **User Management (`System Settings > Users`)**: A centralized and powerful interface for administrators to create, edit, and delete users. The "Add/Edit User" dialog is a tabbed modal that allows for managing user details, group assignments, and area/location access all in one place.

### 3.5. Finance (`/finance`)
- **Segregated Views**: Split into "Organisational" and "Client-Level" finance for clear separation of concerns.
- **Client Expense Manager**: A detailed log for tracking all payments and expenses for a specific client. It features robust filtering (by description, category), sorting, and placeholder export functionality. GST is automatically calculated and displayed for expenses.

### 3.6. System Settings (The Admin "Backend")
This section is the control panel for the entire application, accessible only to `System Admin` roles.
- **Section Manager**: Configure the main navigation items (sidebar), including their names, icons, paths, and order.
- **Tab Manager**: For each section, admins can create and manage the tabs that appear on the page (e.g., the tabs on the Client Profile page).
- **Form Builder**: Design custom forms field-by-field. These forms can then be linked to a Section Tab, allowing for a fully customizable data entry experience across the application.
- **Group Management**: Create user groups and manage their members.
- **Rights Management**: The heart of the permission system. Use a simple grid to assign View/Create/Edit/Delete permissions to each Group for every Section in the app.

## 4. Tech Stack
- **Framework**: Next.js 15 (with App Router)
- **Language**: TypeScript
- **UI**: React, ShadCN UI Components, Tailwind CSS
- **AI**: Genkit (for future AI feature integration)
