# LeaveRequestFrontend

Angular 19 frontend for the Employee Leave Management System.

## Prerequisites
- Node.js 18+
- Angular CLI 19: `npm install -g @angular/cli`

## Setup

```bash
cd LeaveRequestFrontend
npm install
ng serve
```

Open: http://localhost:4200

## Backend Config

The API URL is set in `src/environments/environment.ts`:
```ts
apiUrl: 'http://localhost:5000/api'
```
Update this to match your backend port if different.

## Features

### Pages
| Route | Description |
|-------|-------------|
| `/login` | Email + password login |
| `/register` | New user registration with role selection |
| `/employee` | Employee dashboard — apply & cancel leaves |
| `/manager` | Manager dashboard — review & approve/reject pending leaves |
| `/hr` | HR dashboard — full approval history + pending overview |

### Profile Dropdown (All Dashboards)
- View current role badge
- Switch between Employee / Manager / HR Admin views
- Logout

### Employee Dashboard
- Stats: Pending / Approved / Rejected / Total
- Apply for leave (modal form with leave types)
- Cancel pending leaves
- Full leave history table

### Manager Dashboard
- Card-based view of all pending leaves
- Click "Review & Decide" to open approval modal
- Approve or Reject with optional remarks
- Color-coded decision buttons

### HR Dashboard
- Summary stats
- Tab 1: Full approval history (searchable, filterable)
- Tab 2: All pending leave requests
- Shows employee name + approver name for every record

## Folder Structure

```
src/app/
├── auth/
│   ├── login/
│   └── register/
├── employee/dashboard/
├── manager/dashboard/
├── hr/dashboard/
└── shared/
    ├── header/         # Profile dropdown + role switcher
    ├── guards/         # authGuard, roleGuard
    ├── interceptors/   # JWT auth interceptor
    ├── models/         # TypeScript interfaces
    └── services/       # AuthService, LeaveService
```

## API Endpoints Used

| Method | Endpoint | Used By |
|--------|----------|---------|
| POST | `/api/auth/register` | Register page |
| POST | `/api/auth/login` | Login page |
| GET | `/api/leaverequest/my leave` | Employee dashboard |
| POST | `/api/leaverequest/apply` | Employee dashboard |
| DELETE | `/api/leaverequest/cancel/{id}` | Employee dashboard |
| GET | `/api/leaverequest/pending` | Manager + HR dashboard |
| POST | `/api/approval/process` | Manager dashboard |
| GET | `/api/approval/history` | HR dashboard |
