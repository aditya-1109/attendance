import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Search,
  Calendar,
  X,
  Filter,
  CalendarPlus,
  Clock,
  UserCheck,
  CheckCircle2,
  Users,
  ChevronDown,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../components/Header';
import { AttendanceItem } from '../components/AttendanceItem';
import { CustomDatePickerModal } from '../components/CustomDatePickerModal';
import { markAttendanceByDate } from '../storage/attendanceSlice';

export const AttendanceRecordsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { records } = useSelector((state) => state.attendance);

  const initialDate = route.params?.initialDate || null;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedRole, setSelectedRole] = useState('all'); // 'all', 'staff', 'senior_staff'
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Manual Attendance Marking Modal State
  const [markModalVisible, setMarkModalVisible] = useState(false);
  const [markUserId, setMarkUserId] = useState('');
  const [markDate, setMarkDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [markCheckIn, setMarkCheckIn] = useState('09:00 AM');
  const [markCheckOut, setMarkCheckOut] = useState('05:30 PM');
  const [markDatePickerVisible, setMarkDatePickerVisible] = useState(false);

  // User Map
  const userMap = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});
  }, [users]);

  // Allowed Users by Role
  // Senior Staff can only view records of Staff role
  // Admin can view records of all roles
  const eligibleRecords = useMemo(() => {
    return records.filter((rec) => {
      const user = userMap[rec.userId];
      if (!user) return false;

      if (currentUser?.role === 'senior_staff') {
        return user.role === 'staff';
      }
      return true;
    });
  }, [records, userMap, currentUser]);

  // Apply filters: Search, Date, Role
  const filteredRecords = useMemo(() => {
    return eligibleRecords
      .filter((rec) => {
        const user = userMap[rec.userId];
        if (!user) return false;

        // Search by employee name or email
        const matchesSearch =
          !searchQuery.trim() ||
          user.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.trim().toLowerCase());

        // Filter by date
        const matchesDate = !selectedDate || rec.date === selectedDate;

        // Filter by role (Admin only)
        const matchesRole =
          selectedRole === 'all' || user.role === selectedRole;

        return matchesSearch && matchesDate && matchesRole;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [eligibleRecords, userMap, searchQuery, selectedDate, selectedRole]);

  // Eligible users to mark attendance for
  const markableUsers = useMemo(() => {
    if (currentUser?.role === 'senior_staff') {
      return users.filter((u) => u.role === 'staff');
    }
    return users;
  }, [users, currentUser]);

  // Save Manual Attendance
  const handleSaveAttendance = () => {
    if (!markUserId) {
      Alert.alert('Validation Error', 'Please select an employee.');
      return;
    }
    if (!markDate) {
      Alert.alert('Validation Error', 'Please select a valid date.');
      return;
    }

    dispatch(
      markAttendanceByDate({
        userId: markUserId,
        date: markDate,
        checkInTime: markCheckIn.trim() || '09:00 AM',
        checkOutTime: markCheckOut.trim() || null,
        status: markCheckOut.trim() ? 'checked_out' : 'checked_in',
      })
    );

    Alert.alert('Success', 'Attendance marked successfully!');
    setMarkModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <Header
        title={
          currentUser?.role === 'senior_staff'
            ? 'Staff Attendance'
            : 'Team Attendance'
        }
        subtitle={
          currentUser?.role === 'senior_staff'
            ? 'Monitoring Staff records'
            : 'Workforce records & logs'
        }
        showBack={true}
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employee by name..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Mark Attendance Button */}
          <TouchableOpacity
            style={styles.markActionBtn}
            onPress={() => {
              setMarkUserId(markableUsers[0]?.id || '');
              setMarkModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <CalendarPlus size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Date Filter & Clear Controls */}
        <View style={styles.filterControlsRow}>
          <TouchableOpacity
            style={[
              styles.dateFilterChip,
              selectedDate && styles.dateFilterChipActive,
            ]}
            onPress={() => setDatePickerVisible(true)}
            activeOpacity={0.7}
          >
            <Calendar
              size={14}
              color={selectedDate ? '#4f46e5' : '#64748b'}
            />
            <Text
              style={[
                styles.dateFilterText,
                selectedDate && styles.dateFilterTextActive,
              ]}
            >
              {selectedDate ? `Date: ${selectedDate}` : 'Filter by Date'}
            </Text>
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity
              style={styles.clearDateBtn}
              onPress={() => setSelectedDate(null)}
              activeOpacity={0.7}
            >
              <X size={14} color="#dc2626" />
              <Text style={styles.clearDateText}>Clear Date</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Role Filter Tabs (Only Admin) */}
        {currentUser?.role === 'admin' && (
          <View style={styles.roleTabs}>
            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'all' && styles.roleTabActive,
              ]}
              onPress={() => setSelectedRole('all')}
            >
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'all' && styles.roleTabTextActive,
                ]}
              >
                All Roles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'staff' && styles.roleTabActive,
              ]}
              onPress={() => setSelectedRole('staff')}
            >
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'staff' && styles.roleTabTextActive,
                ]}
              >
                Staff Only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'senior_staff' && styles.roleTabActive,
              ]}
              onPress={() => setSelectedRole('senior_staff')}
            >
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'senior_staff' && styles.roleTabTextActive,
                ]}
              >
                Senior Staff
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Records Count Summary */}
        <View style={styles.countSummary}>
          <Text style={styles.countText}>
            Showing <Text style={styles.countBold}>{filteredRecords.length}</Text>{' '}
            record{filteredRecords.length === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Records List */}
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AttendanceItem record={item} user={userMap[item.userId]} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={32} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Matching Records</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search query, role filter, or date picker.
              </Text>
            </View>
          }
        />
      </View>

      {/* Date Picker Filter Modal */}
      <CustomDatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedDate={selectedDate}
        onSelectDate={(picked) => setSelectedDate(picked)}
        title="Filter Attendance by Date"
      />

      {/* Manual Mark Attendance Modal */}
      <Modal
        visible={markModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMarkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.markModalBox}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <CalendarPlus size={18} color="#4f46e5" />
                <Text style={styles.modalTitle}>Mark Attendance</Text>
              </View>
              <TouchableOpacity
                onPress={() => setMarkModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Employee Selection */}
              <Text style={styles.modalLabel}>Select Employee</Text>
              <View style={styles.userSelectionList}>
                {markableUsers.map((u) => {
                  const isSelected = markUserId === u.id;
                  return (
                    <TouchableOpacity
                      key={u.id}
                      style={[
                        styles.userSelectChip,
                        isSelected && styles.userSelectChipActive,
                      ]}
                      onPress={() => setMarkUserId(u.id)}
                    >
                      <Text
                        style={[
                          styles.userSelectName,
                          isSelected && styles.userSelectNameActive,
                        ]}
                      >
                        {u.name} ({u.role})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Date Selection */}
              <Text style={styles.modalLabel}>Attendance Date</Text>
              <TouchableOpacity
                style={styles.modalInputWrapper}
                onPress={() => setMarkDatePickerVisible(true)}
              >
                <Calendar size={18} color="#4f46e5" />
                <Text style={styles.modalDateDisplay}>{markDate}</Text>
                <ChevronDown size={16} color="#94a3b8" />
              </TouchableOpacity>

              {/* Check-In Time */}
              <Text style={styles.modalLabel}>Check-In Time</Text>
              <View style={styles.modalInputWrapper}>
                <Clock size={18} color="#94a3b8" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 09:00 AM"
                  placeholderTextColor="#94a3b8"
                  value={markCheckIn}
                  onChangeText={setMarkCheckIn}
                />
              </View>

              {/* Check-Out Time */}
              <Text style={styles.modalLabel}>
                Check-Out Time (leave empty if still checked in)
              </Text>
              <View style={styles.modalInputWrapper}>
                <Clock size={18} color="#94a3b8" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 05:30 PM (optional)"
                  placeholderTextColor="#94a3b8"
                  value={markCheckOut}
                  onChangeText={setMarkCheckOut}
                />
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setMarkModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveAttendance}
              >
                <Text style={styles.modalSaveText}>Save Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nested Date Picker for marking date */}
        <CustomDatePickerModal
          visible={markDatePickerVisible}
          onClose={() => setMarkDatePickerVisible(false)}
          selectedDate={markDate}
          onSelectDate={(newDate) => setMarkDate(newDate)}
          title="Pick Attendance Date"
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  markActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dateFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateFilterChipActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  dateFilterTextActive: {
    color: '#4f46e5',
  },
  clearDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  clearDateText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    padding: 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  roleTabTextActive: {
    color: '#0f172a',
  },
  countSummary: {
    marginBottom: 8,
  },
  countText: {
    fontSize: 12,
    color: '#64748b',
  },
  countBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  markModalBox: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  userSelectionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  userSelectChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userSelectChipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  userSelectName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  userSelectNameActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  modalDateDisplay: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
