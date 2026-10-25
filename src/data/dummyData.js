// Dummy users and attendance data

// Format date helper: YYYY-MM-DD
export const getFormattedDate = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_USERS = [
  {
    id: 'usr_admin_1',
    name: 'Alex Morgan',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Executive Operations',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr_senior_1',
    name: 'Sarah Jenkins',
    email: 'senior@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    department: 'Engineering Lead',
    createdAt: '2026-01-15',
  },
  {
    id: 'usr_senior_2',
    name: 'Sophia Garcia',
    email: 'sophia@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    department: 'Quality Assurance Lead',
    createdAt: '2026-01-20',
  },
  {
    id: 'usr_staff_1',
    name: 'David Miller',
    email: 'staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Software Engineering',
    createdAt: '2026-02-01',
  },
  {
    id: 'usr_staff_2',
    name: 'Emma Watson',
    email: 'emma@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Product Design',
    createdAt: '2026-02-05',
  },
  {
    id: 'usr_staff_3',
    name: 'John Doe',
    email: 'john@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Data Analytics',
    createdAt: '2026-02-10',
  },
  {
    id: 'usr_staff_4',
    name: 'Michael Brown',
    email: 'michael@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Customer Support',
    createdAt: '2026-02-15',
  },
];

export const getInitialAttendanceRecords = () => {
  const today = getFormattedDate(0);
  const yesterday = getFormattedDate(1);
  const twoDaysAgo = getFormattedDate(2);
  const threeDaysAgo = getFormattedDate(3);

  return [
    // Today records
    {
      id: 'att_today_1',
      userId: 'usr_senior_1',
      date: today,
      checkInTime: '08:55 AM',
      checkOutTime: null,
      status: 'checked_in',
    },
    {
      id: 'att_today_2',
      userId: 'usr_staff_2',
      date: today,
      checkInTime: '09:02 AM',
      checkOutTime: '05:30 PM',
      status: 'checked_out',
    },
    {
      id: 'att_today_3',
      userId: 'usr_staff_3',
      date: today,
      checkInTime: '09:15 AM',
      checkOutTime: null,
      status: 'checked_in',
    },
    // Note: David Miller (usr_staff_1) starts today as not checked in yet so you can test check-in!

    // Yesterday records
    {
      id: 'att_yest_1',
      userId: 'usr_staff_1',
      date: yesterday,
      checkInTime: '09:00 AM',
      checkOutTime: '05:15 PM',
      status: 'checked_out',
    },
    {
      id: 'att_yest_2',
      userId: 'usr_staff_2',
      date: yesterday,
      checkInTime: '09:10 AM',
      checkOutTime: '05:45 PM',
      status: 'checked_out',
    },
    {
      id: 'att_yest_3',
      userId: 'usr_staff_3',
      date: yesterday,
      checkInTime: '08:50 AM',
      checkOutTime: '05:00 PM',
      status: 'checked_out',
    },
    {
      id: 'att_yest_4',
      userId: 'usr_senior_1',
      date: yesterday,
      checkInTime: '08:45 AM',
      checkOutTime: '05:20 PM',
      status: 'checked_out',
    },
    {
      id: 'att_yest_5',
      userId: 'usr_admin_1',
      date: yesterday,
      checkInTime: '09:30 AM',
      checkOutTime: '06:00 PM',
      status: 'checked_out',
    },

    // Two days ago records
    {
      id: 'att_2d_1',
      userId: 'usr_staff_1',
      date: twoDaysAgo,
      checkInTime: '09:05 AM',
      checkOutTime: '05:10 PM',
      status: 'checked_out',
    },
    {
      id: 'att_2d_2',
      userId: 'usr_staff_2',
      date: twoDaysAgo,
      checkInTime: '09:15 AM',
      checkOutTime: '05:35 PM',
      status: 'checked_out',
    },
    {
      id: 'att_2d_3',
      userId: 'usr_senior_1',
      date: twoDaysAgo,
      checkInTime: '08:50 AM',
      checkOutTime: '05:15 PM',
      status: 'checked_out',
    },

    // Three days ago records
    {
      id: 'att_3d_1',
      userId: 'usr_staff_1',
      date: threeDaysAgo,
      checkInTime: '08:58 AM',
      checkOutTime: '05:05 PM',
      status: 'checked_out',
    },
    {
      id: 'att_3d_2',
      userId: 'usr_staff_4',
      date: threeDaysAgo,
      checkInTime: '09:12 AM',
      checkOutTime: '05:30 PM',
      status: 'checked_out',
    },
  ];
};
