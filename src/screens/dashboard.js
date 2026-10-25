import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Users,
  UserCheck,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronRight,
  UserPlus,
  FileSpreadsheet,
  History,
  CalendarCheck,
  ArrowRight,
  Shield,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { AttendanceItem } from '../components/AttendanceItem';
import { CustomDatePickerModal } from '../components/CustomDatePickerModal';
import { recordCheckIn, recordCheckOut } from '../storage/attendanceSlice';

export const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { records } = useSelector((state) => state.attendance);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [pickedDate, setPickedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Helper for current date
  const today = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // User map for quick lookup
  const userMap = users.reduce((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {});

  // Current logged in user's today attendance record
  const myTodayRecord = records.find(
    (r) => r.userId === currentUser?.id && r.date === today
  );

  // Current time generator (e.g., "09:30 AM")
  const getCurrentFormattedTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Check In Handler
  const handleCheckIn = () => {
    if (!currentUser) return;
    if (myTodayRecord?.checkInTime) {
      Alert.alert('Notice', 'You have already checked in for today.');
      return;
    }

    const time = getCurrentFormattedTime();
    dispatch(
      recordCheckIn({
        userId: currentUser.id,
        date: today,
        checkInTime: time,
      })
    );
  };

  // Check Out Handler
  const handleCheckOut = () => {
    if (!currentUser) return;
    if (!myTodayRecord || !myTodayRecord.checkInTime) {
      Alert.alert('Notice', 'You must check in first before checking out.');
      return;
    }
    if (myTodayRecord.checkOutTime) {
      Alert.alert('Notice', 'You have already checked out for today.');
      return;
    }

    const time = getCurrentFormattedTime();
    dispatch(
      recordCheckOut({
        userId: currentUser.id,
        date: today,
        checkOutTime: time,
      })
    );
  };

  /* ==============================================================
     ROLE SPECIFIC STATS CALCULATION
     ============================================================== */
  // Admin stats
  const totalUsersCount = users.length;
  const staffMembersCount = users.filter((u) => u.role === 'staff').length;
  const seniorStaffCount = users.filter((u) => u.role === 'senior_staff').length;

  const usersCheckedInTodayCount = users.filter((u) => {
    const rec = records.find((r) => r.userId === u.id && r.date === today);
    return rec && (rec.status === 'checked_in' || rec.status === 'checked_out');
  }).length;

  const usersNotCheckedInTodayCount = totalUsersCount - usersCheckedInTodayCount;

  // Senior Staff stats (Staff only)
  const staffUsers = users.filter((u) => u.role === 'staff');
  const staffTotalCount = staffUsers.length;
  const staffCheckedInCount = staffUsers.filter((u) => {
    const rec = records.find((r) => r.userId === u.id && r.date === today);
    return rec && (rec.status === 'checked_in' || rec.status === 'checked_out');
  }).length;
  const staffNotCheckedInCount = staffTotalCount - staffCheckedInCount;

  // Recent attendance records for Admin
  const recentAttendanceList = records
    .slice(0, 5)
    .map((rec) => ({ ...rec, user: userMap[rec.userId] }));

  // Staff today attendance records for Senior Staff
  const seniorStaffTodayList = records
    .filter((r) => {
      const u = userMap[r.userId];
      return r.date === today && u && u.role === 'staff';
    })
    .map((r) => ({ ...r, user: userMap[r.userId] }));

  /* ==============================================================
     RENDER: PERSONAL ATTENDANCE CARD (Used by all roles)
     ============================================================== */
  const renderPersonalAttendanceCard = () => {
    const isCheckedIn = !!myTodayRecord?.checkInTime;
    const isCheckedOut = !!myTodayRecord?.checkOutTime;

    return (
      <View style={styles.actionCard}>
        <View style={styles.actionHeader}>
          <View>
            <Text style={styles.actionSectionTitle}>Today's Attendance</Text>
            <Text style={styles.actionDateText}>{formattedToday}</Text>
          </View>

          <View
            style={[
              styles.statusChip,
              isCheckedOut
                ? styles.chipCompleted
                : isCheckedIn
                ? styles.chipActive
                : styles.chipPending,
            ]}
          >
            {isCheckedOut ? (
              <CheckCircle2 size={12} color="#059669" />
            ) : isCheckedIn ? (
              <Clock size={12} color="#2563eb" />
            ) : (
              <XCircle size={12} color="#dc2626" />
            )}
            <Text
              style={[
                styles.statusChipText,
                isCheckedOut
                  ? styles.chipTextCompleted
                  : isCheckedIn
                  ? styles.chipTextActive
                  : styles.chipTextPending,
              ]}
            >
              {isCheckedOut
                ? 'Completed'
                : isCheckedIn
                ? 'Checked In'
                : 'Not Checked In'}
            </Text>
          </View>
        </View>

        {/* Timestamps */}
        <View style={styles.timesContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeBlockLabel}>Check-In Time</Text>
            <Text style={styles.timeBlockValue}>
              {myTodayRecord?.checkInTime || '--:--'}
            </Text>
          </View>
          <View style={styles.verticalSeparator} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeBlockLabel}>Check-Out Time</Text>
            <Text style={styles.timeBlockValue}>
              {myTodayRecord?.checkOutTime || '--:--'}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.btnRow}>
          {!isCheckedIn ? (
            <TouchableOpacity
              style={styles.checkInBtn}
              onPress={handleCheckIn}
              activeOpacity={0.8}
            >
              <Clock size={16} color="#ffffff" />
              <Text style={styles.checkBtnText}>Check In Now</Text>
            </TouchableOpacity>
          ) : !isCheckedOut ? (
            <TouchableOpacity
              style={styles.checkOutBtn}
              onPress={handleCheckOut}
              activeOpacity={0.8}
            >
              <CheckCircle2 size={16} color="#ffffff" />
              <Text style={styles.checkBtnText}>Check Out Now</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedBanner}>
              <CheckCircle2 size={16} color="#059669" />
              <Text style={styles.completedText}>
                Attendance Completed for Today
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  /* ==============================================================
     DASHBOARD CONTENT BY ROLE
     ============================================================== */
  return (
    <View style={styles.screen}>
      <Header
        title="Attendance Dashboard"
        subtitle={currentUser ? `Welcome back, ${currentUser.name}` : ''}
        showBack={false}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Date / Quick Filter Banner with DatePicker */}
        <TouchableOpacity
          style={styles.datePickerBanner}
          onPress={() => setDatePickerVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.bannerLeft}>
            <Calendar size={18} color="#4f46e5" />
            <Text style={styles.bannerText}>
              Viewing Date: <Text style={styles.bannerBold}>{pickedDate}</Text>
            </Text>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.changeDateText}>Change Date</Text>
            <ChevronRight size={15} color="#4f46e5" />
          </View>
        </TouchableOpacity>

        {/* ================= ADMIN VIEW ================= */}
        {currentUser?.role === 'admin' && (
          <>
            {/* Admin Metrics */}
            <Text style={styles.sectionHeader}>Workforce Metrics</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon={Users}
                value={totalUsersCount}
                label="Total Users"
                color="#4f46e5"
                bgColor="#eef2ff"
                borderColor="#e0e7ff"
              />
              <StatCard
                icon={UserCheck}
                value={seniorStaffCount}
                label="Senior Staff"
                color="#7c3aed"
                bgColor="#f5f3ff"
                borderColor="#ede9fe"
              />
              <StatCard
                icon={User}
                value={staffMembersCount}
                label="Staff Members"
                color="#0284c7"
                bgColor="#f0f9ff"
                borderColor="#e0f2fe"
              />
              <StatCard
                icon={CheckCircle2}
                value={usersCheckedInTodayCount}
                label="Checked In Today"
                color="#059669"
                bgColor="#ecfdf5"
                borderColor="#d1fae5"
              />
              <StatCard
                icon={XCircle}
                value={usersNotCheckedInTodayCount}
                label="Not Checked In"
                color="#dc2626"
                bgColor="#fef2f2"
                borderColor="#fee2e2"
              />
            </View>

            {/* Admin Self Check-In / Check-Out */}
            {renderPersonalAttendanceCard()}

            {/* Quick Navigation Cards */}
            <Text style={styles.sectionHeader}>Management Hub</Text>
            <View style={styles.navCardsRow}>
              <TouchableOpacity
                style={styles.navCard}
                onPress={() => navigation.navigate('UserManagement')}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBox, { backgroundColor: '#eff6ff' }]}>
                  <UserPlus size={18} color="#2563eb" />
                </View>
                <View style={styles.navCardText}>
                  <Text style={styles.navCardTitle}>User Management</Text>
                  <Text style={styles.navCardDesc}>
                    Create, edit & remove users
                  </Text>
                </View>
                <ArrowRight size={16} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navCard}
                onPress={() =>
                  navigation.navigate('AttendanceRecords', { initialDate: pickedDate })
                }
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBox, { backgroundColor: '#f0fdf4' }]}>
                  <FileSpreadsheet size={18} color="#16a34a" />
                </View>
                <View style={styles.navCardText}>
                  <Text style={styles.navCardTitle}>Team Attendance</Text>
                  <Text style={styles.navCardDesc}>
                    Filter by date & employee
                  </Text>
                </View>
                <ArrowRight size={16} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navCard}
                onPress={() => navigation.navigate('AttendanceHistory')}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBox, { backgroundColor: '#fdf4ff' }]}>
                  <History size={18} color="#c026d3" />
                </View>
                <View style={styles.navCardText}>
                  <Text style={styles.navCardTitle}>My History</Text>
                  <Text style={styles.navCardDesc}>
                    Personal attendance records
                  </Text>
                </View>
                <ArrowRight size={16} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Recent Attendance Feed */}
            <View style={styles.feedHeaderRow}>
              <Text style={styles.sectionHeader}>Recent Attendance Feed</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AttendanceRecords')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentAttendanceList.map((rec) => (
              <AttendanceItem key={rec.id} record={rec} user={rec.user} />
            ))}
          </>
        )}

        {/* ================= SENIOR STAFF VIEW ================= */}
        {currentUser?.role === 'senior_staff' && (
          <>
            {/* Senior Staff Metrics (Staff Only) */}
            <Text style={styles.sectionHeader}>Staff Monitoring Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon={Users}
                value={staffTotalCount}
                label="Total Staff"
                color="#4f46e5"
                bgColor="#eef2ff"
                borderColor="#e0e7ff"
              />
              <StatCard
                icon={CheckCircle2}
                value={staffCheckedInCount}
                label="Staff Checked In"
                color="#059669"
                bgColor="#ecfdf5"
                borderColor="#d1fae5"
              />
              <StatCard
                icon={XCircle}
                value={staffNotCheckedInCount}
                label="Staff Not Checked In"
                color="#dc2626"
                bgColor="#fef2f2"
                borderColor="#fee2e2"
              />
            </View>

            {/* Senior Staff Self Check-In / Check-Out */}
            {renderPersonalAttendanceCard()}

            {/* Quick Navigation Cards */}
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <View style={styles.navCardsRow}>
              <TouchableOpacity
                style={styles.navCard}
                onPress={() =>
                  navigation.navigate('AttendanceRecords', { initialDate: pickedDate })
                }
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBox, { backgroundColor: '#f0fdf4' }]}>
                  <FileSpreadsheet size={18} color="#16a34a" />
                </View>
                <View style={styles.navCardText}>
                  <Text style={styles.navCardTitle}>Staff Attendance Logs</Text>
                  <Text style={styles.navCardDesc}>
                    Date picker & employee filter
                  </Text>
                </View>
                <ArrowRight size={16} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navCard}
                onPress={() => navigation.navigate('AttendanceHistory')}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBox, { backgroundColor: '#fdf4ff' }]}>
                  <History size={18} color="#c026d3" />
                </View>
                <View style={styles.navCardText}>
                  <Text style={styles.navCardTitle}>My Personal History</Text>
                  <Text style={styles.navCardDesc}>
                    Review your past attendance
                  </Text>
                </View>
                <ArrowRight size={16} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Today's Staff Records */}
            <Text style={styles.sectionHeader}>Today's Staff Activity</Text>
            {seniorStaffTodayList.length > 0 ? (
              seniorStaffTodayList.map((rec) => (
                <AttendanceItem key={rec.id} record={rec} user={rec.user} />
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Clock size={24} color="#94a3b8" />
                <Text style={styles.emptyText}>
                  No staff members have checked in today yet.
                </Text>
              </View>
            )}
          </>
        )}

        {/* ================= STAFF VIEW ================= */}
        {currentUser?.role === 'staff' && (
          <>
            {/* Staff Self Check-In / Check-Out */}
            {renderPersonalAttendanceCard()}

            {/* Profile Information Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Employee Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employee Name:</Text>
                <Text style={styles.infoValue}>{currentUser?.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department:</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.department || 'Staff Member'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employee ID:</Text>
                <Text style={styles.infoValue}>{currentUser?.id}</Text>
              </View>
            </View>

            {/* Shortcut to History */}
            <TouchableOpacity
              style={styles.historyShortcutBtn}
              onPress={() => navigation.navigate('AttendanceHistory')}
              activeOpacity={0.7}
            >
              <View style={styles.shortcutIconRow}>
                <History size={20} color="#4f46e5" />
                <View>
                  <Text style={styles.shortcutTitle}>
                    View Attendance History
                  </Text>
                  <Text style={styles.shortcutSubtitle}>
                    Review past check-in and check-out logs
                  </Text>
                </View>
              </View>
              <ArrowRight size={18} color="#4f46e5" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      <CustomDatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedDate={pickedDate}
        onSelectDate={(newDate) => {
          setPickedDate(newDate);
          if (currentUser?.role === 'admin' || currentUser?.role === 'senior_staff') {
            navigation.navigate('AttendanceRecords', { initialDate: newDate });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  datePickerBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    fontSize: 13,
    color: '#475569',
  },
  bannerBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  changeDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 14,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 8,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  actionSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionDateText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipCompleted: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  chipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  chipPending: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextCompleted: {
    color: '#059669',
  },
  chipTextActive: {
    color: '#2563eb',
  },
  chipTextPending: {
    color: '#dc2626',
  },
  timesContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeBlockLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  timeBlockValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 10,
  },
  btnRow: {
    marginTop: 2,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#d97706',
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  completedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  navCardsRow: {
    gap: 8,
    marginBottom: 12,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navCardText: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  navCardDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  historyShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  shortcutIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  shortcutSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
