# 🏛️ Barangay Platero Management System
### Biñan City, Laguna – Digital Governance Platform

A modern, production-ready frontend web application for Barangay Platero's management needs.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm v9+

### Installation & Running

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🔐 Admin Login Credentials

| Username     | Password       | Role       |
|--------------|----------------|------------|
| `admin`      | `admin123`     | Secretary  |
| `treasurer`  | `treasurer123` | Treasurer  |

---

## 📁 Project Structure

```
/barangay
  /client                          # React frontend (Vite)
    /src
      /assets/svg                  # Custom SVG icon components
        Icons.jsx                  # All SVG icons (no external libraries)
      /components                  # Reusable UI components
        Card.jsx
        Form.jsx                   # FormField, Input, Select, Textarea
        Modal.jsx
        Navbar.jsx                 # Public site navigation
        Sidebar.jsx                # Admin panel sidebar
        Table.jsx
      /context
        AuthContext.jsx            # Mock authentication context
      /data
        mockData.js                # All mock data + helper functions
      /modules                     # Feature modules
        /Dashboard                 # Overview stats & activity feed
        /Residents                 # CRUD for barangay residents
        /Businesses                # Business registration & permit tracking
        /Complaints                # Complaint filing & status management
        /Certificates              # Certificate generator with print layout
        /Reports                   # Records & analytics
        /AdminAccounts             # Admin user management
      /pages
        Home.jsx                   # Public landing page
        AdminLogin.jsx             # Admin authentication page
        AdminDashboard.jsx         # Admin panel shell with sidebar
      App.jsx                      # Router setup
      main.jsx                     # React entry point
      index.css                    # Tailwind + global styles
    index.html
    package.json
    vite.config.js
    tailwind.config.js
  /server                          # Backend placeholder (not implemented)
    README.md
```

---

## 🎨 Tech Stack

| Layer       | Technology              |
|-------------|------------------------|
| Framework   | React 18 + Vite        |
| Styling     | Tailwind CSS v3        |
| Routing     | React Router v6        |
| Icons       | Custom SVG (no libraries) |
| Data        | Mock (no backend)      |

---

## 📦 Features

### 🌐 Public Landing Page
- Barangay introduction with hero section
- Mission & Vision
- Officials listing
- Services overview
- Announcements
- Contact information
- Admin login button

### 🔐 Admin Panel
| Module              | Features                                              |
|---------------------|-------------------------------------------------------|
| **Dashboard**       | Stats overview, recent activity, quick actions        |
| **Residents**       | Register, view, edit, delete · Special classification |
| **Businesses**      | Register, permit tracking, status filter              |
| **Complaints**      | File, update status, priority, assignment             |
| **Certificates**    | Issue & print: Clearance, Indigency, Solo Parent, etc.|
| **Records**         | Transaction log, charts, breakdowns                   |
| **Admin Accounts**  | Create and manage admin users                         |

---

## 🖨️ Certificate Printing
Navigate to **Certificates** → click the 🖨️ icon → **Print** button triggers browser print dialog.

Supported certificate types:
- Barangay Clearance
- Business Permit
- Solo Parent Certificate
- Certificate of Indigency
- Complaint Certification

---

## 📊 Mock Data Included
- 3 residents (including senior, solo parent, indigent)
- 3 businesses (active and expired permits)
- 3 complaints (pending, resolved, under investigation)
- 3 certificates issued
- 2 admin accounts
- 4 announcements

---

## 🏗️ Build for Production

```bash
cd client
npm run build
# Output in /client/dist
```

---

*Barangay Platero Management System v1.0 · Biñan City, Laguna*
# platero-bms
