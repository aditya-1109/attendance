# Attendance Management App (React Native)

This is a mobile attendance management application built as part of the technical assessment. It allows employees to record daily check-ins and check-outs, view history, and view/manage records according to their assigned roles (**Admin**, **Senior Staff**, and **Staff**).

Since a backend service was not required, all state is handled using **Redux Toolkit** and synced locally with **AsyncStorage** so that your data, attendance actions, and any new users persist across app reloads.

---

## Quick Test Credentials

The app seeds predefined accounts on first launch, so registration is not required. You can either type the credentials below or tap the **Quick Demo Login** buttons on the login screen to autofill:

| Role | Email | Password | What they can see / do |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `Admin@123` | Full dashboard metrics, all attendance logs, user management (create, edit, delete users), date filtering |
| **Senior Staff** | `senior@test.com` | `Senior@123` | Staff-only statistics & attendance logs, personal attendance tracking (Admin/other Senior Staff records are restricted) |
| **Staff** | `staff@test.com` | `Staff@123` | Today's status, Check-In / Check-Out buttons, personal attendance history |

*Additional dummy staff accounts are also preloaded:*
- Emma Watson: `emma@test.com` / `Staff@123`
- John Doe: `john@test.com` / `Staff@123`
- Michael Brown: `michael@test.com` / `Staff@123`
- Sophia Garcia: `sophia@test.com` / `Senior@123`

---

## What's Implemented

- **Splash Screen**: Initial loading screen showing the app title and branding while initializing AsyncStorage and restoring existing sessions.
- **Role-Based Dashboards**:
  - **Admin**: Summary cards for total users, senior staff count, staff count, checked in today, and not checked in today. Recent attendance stream and quick navigation links.
  - **Senior Staff**: Staff-only breakdown (total staff, staff checked in today, staff not checked in today) and today's staff logs.
  - **Staff**: Clean personal check-in/out card with live status, timestamps, and quick shortcut to history.
- **Attendance Rules & Logic**:
  - One attendance record per employee per calendar day.
  - Check-in records current system timestamp automatically.
  - Check-out is disabled until the user has checked in.
  - Cannot check out multiple times on the same day.
  - Immediate state reflection on the screen via Redux.
- **Date Picker & Attendance Logs**:
  - Interactive date picker to view records by date or reset to today.
  - Search employees by name or email.
  - Role filter tabs for Admin (All, Staff, Senior Staff).
  - "Mark Attendance" option to log attendance for an employee on any selected date.
- **Admin User Management**:
  - Full CRUD functionality: create new employee, edit existing user info/roles, and delete users (with confirmation alert).
- **Icons & UI**:
  - Exclusively built using `lucide-react-native` icons (including eye / eye-off toggle on password input). No emojis used anywhere in the app.

---

## Tech Stack & Architecture Decisions

- **Framework**: React Native (CLI, 0.88)
- **Navigation**: `@react-navigation/native-stack` for screen transitions (Splash &rarr; Login &rarr; Dashboard &rarr; Records / History / User Management).
- **State Management**: `@reduxjs/toolkit` and `react-redux`.
  - `authSlice.js`: Current logged-in user session, authentication status.
  - `usersSlice.js`: Employee list with create, update, and delete actions.
  - `attendanceSlice.js`: Check-in, check-out, and date-based marking actions.
- **Local Storage**: `@react-native-async-storage/async-storage` for saving state so data isn't wiped when restarting the application.
- **Icons**: `lucide-react-native` with `react-native-svg`.

### Folder Structure

```text
src/
├── components/          # Reusable UI widgets
│   ├── AttendanceItem.js        # Attendance card with status chips & times
│   ├── CustomDatePickerModal.js # Calendar modal for filtering & marking by date
│   ├── Header.js                # Top bar with role badge & logout
│   ├── StatCard.js              # Numeric dashboard metric cards
│   ├── UserItem.js              # Employee list card with edit/delete
│   └── UserModal.js             # Form modal for adding / editing employees
├── data/
│   └── dummyData.js     # Default accounts and historical attendance seeds
├── navigation/
│   └── routeNavigation.js # Native stack navigation configuration
├── screens/
│   ├── splash.js        # Startup splash screen
│   ├── login.js         # Authentication screen with eye toggle
│   ├── dashboard.js     # Dynamic role-based dashboard
│   ├── attendanceHistory.js # Personal attendance history
│   ├── attendanceRecords.js # Filterable team attendance screen
│   └── userManagement.js    # Admin employee CRUD screen
└── storage/
    ├── asyncStorage.js  # AsyncStorage bootstrap & persistence helpers
    ├── authSlice.js     # Redux slice for authentication & session
    ├── usersSlice.js    # Redux slice for user CRUD
    ├── attendanceSlice.js # Redux slice for attendance check-in/out
    ├── store.js         # Redux store setup
    └── redux.js         # Central export file
```

---

## Setup & Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start Metro bundler

```bash
npm start
```

### 3. Run the app

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
cd ios
pod install
cd ..
npm run ios
```

---

## How to Test Each Scenario

1. **Login & Error Handling**:
   - Try logging in with empty inputs or a wrong password &rarr; validation error shows up.
   - Click the eye icon next to the password input to verify toggle behavior.
   - Use the one-tap demo buttons to quickly switch between accounts.

2. **Testing Staff Check-in / Check-out**:
   - Log in as `staff@test.com` (`Staff@123`).
   - Notice today's status is "Not Checked In".
   - Tap **"Check In Now"** &rarr; button updates immediately to "Check Out Now" and shows the recorded check-in time.
   - Tap **"Check Out Now"** &rarr; status updates to "Completed" and both in/out timestamps are visible. Further checkouts are locked.
   - Tap **"View Attendance History"** to see your previous records.

3. **Testing Senior Staff**:
   - Log in as `senior@test.com` (`Senior@123`).
   - Notice metrics only count Staff members.
   - Open **Staff Attendance Logs** &rarr; check that Admin records and other Senior Staff records are excluded.
   - Try searching an employee by name or picking a date via the date picker.

4. **Testing Admin & User Management**:
   - Log in as `admin@test.com` (`Admin@123`).
   - Go to **User Management** &rarr; tap **"Add User"** and fill in details &rarr; new user appears in the list and can now log in.
   - Tap the pencil icon to edit an employee's department or role.
   - Tap the trash icon to delete an employee (confirmation modal appears).
   - Go to **Team Attendance** &rarr; use the role tabs (`All Roles`, `Staff Only`, `Senior Staff`) and date picker to filter records.
   - Tap the top-right calendar icon to manually log attendance for an employee on any given date.

5. **Persistence**:
   - Add a user or check in/out. Close the app completely and reopen. All changes remain saved in AsyncStorage.
