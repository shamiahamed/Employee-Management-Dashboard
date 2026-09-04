# Employee Management Dashboard

A React-based Employee Management Dashboard with authentication, CRUD operations, search/filter, pagination, and analytics — built for the technical assessment.

## Tech Stack
- React 19 (functional components + hooks)
- React Router DOM (routing + protected routes)
- Axios (API calls)
- Context API (auth state)
- Tailwind CSS (styling)
- Recharts (analytics charts)
- json-server (mock REST API / backend)

## Features
- **Authentication**: login form with client-side validation, JWT-style token issued on login, stored in localStorage (Remember me) or sessionStorage, protected routes, logout.
- **Employee listing**: table with name, email, department, designation, status, joining date.
- **CRUD**: add, edit, delete (with confirmation modal) employees via a modal form with validation.
- **Search & filter**: debounced search by name/email, filter by department and status.
- **Analytics**: total employees, active employees, department-wise bar chart, status distribution pie chart, monthly joined line chart.
- **Pagination**: client-side pagination on the filtered employee list.
- **Loading / error / empty states**: spinner while fetching, retry on API error, empty-state message when filters return nothing.

## Getting Started

```bash
npm install
npm run dev:all   # starts json-server (port 4000) + Vite dev server (port 5173) together
```

Or run them separately:

```bash
npm run server   # json-server on http://localhost:4000
npm run dev      # Vite on http://localhost:5173
```

Open http://localhost:5173

### Demo login
```
Email: admin@company.com
Password: admin123
```

## Notes on Auth
`json-server` has no real auth layer, so login validates the email/password against the `users` table in `db.json` and mints a JWT-shaped token client-side (header.payload.signature, base64-encoded) which is attached as a `Bearer` token on every API request via an Axios interceptor. This mirrors how the app would behave against a real Node/Express + JWT backend — swapping in a real `/auth/login` endpoint that returns a signed JWT would require no changes on the frontend beyond the API URL.

## Project Structure
```
employee-dashboard/
├── server/
│   └── db.json              # mock employees + users data for json-server
│
├── src/                     # client — React / Vite app
│   ├── components/          # Navbar, EmployeeTable, EmployeeForm,
│   │                        # ConfirmModal, Pagination, Analytics, ProtectedRoute
│   ├── constants/
│   │   └── employee.js      # PAGE_SIZE, DEPARTMENTS, STATUSES, STATUS_BADGE_CLASSES
│   ├── context/
│   │   └── AuthContext.jsx  # login / logout / token state (Context API)
│   ├── hooks/
│   │   └── useDebounce.js   # reusable debounce hook
│   ├── pages/               # Login, Dashboard
│   └── services/
│       └── api.js           # Axios instance + auth + CRUD API calls
│
├── index.html
├── package.json
└── vite.config.js
```

## Build
```bash
npm run build
```
