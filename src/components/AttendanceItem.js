import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

export const AttendanceItem = ({ record, user }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'checked_out':
        return {
          label: 'Completed',
          bgColor: '#ecfdf5',
          textColor: '#059669',
          borderColor: '#a7f3d0',
          Icon: CheckCircle2,
        };
      case 'checked_in':
        return {
          label: 'Checked In',
          bgColor: '#eff6ff',
          textColor: '#2563eb',
          borderColor: '#bfdbfe',
          Icon: Clock,
        };
      default:
        return {
          label: 'Not Checked In',
          bgColor: '#fff1f2',
          textColor: '#e11d48',
          borderColor: '#fecdd3',
          Icon: XCircle,
        };
    }
  };

  const statusConfig = getStatusConfig(record?.status);
  const StatusIcon = statusConfig.Icon;

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'senior_staff') return 'Senior Staff';
    return 'Staff';
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user ? user.name : 'Unknown User'}</Text>
          <View style={styles.metaRow}>
            {user?.role && (
              <Text style={styles.userRole}>{getRoleLabel(user.role)}</Text>
            )}
            <Text style={styles.dateDot}>•</Text>
            <Text style={styles.dateText}>{record?.date}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusConfig.bgColor,
              borderColor: statusConfig.borderColor,
            },
          ]}
        >
          <StatusIcon size={12} color={statusConfig.textColor} />
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBox}>
          <View style={styles.timeIconLabel}>
            <ArrowDownLeft size={13} color="#2563eb" />
            <Text style={styles.timeLabel}>In</Text>
          </View>
          <Text style={styles.timeValue}>{record?.checkInTime || '--:--'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.timeBox}>
          <View style={styles.timeIconLabel}>
            <ArrowUpRight size={13} color="#d97706" />
            <Text style={styles.timeLabel}>Out</Text>
          </View>
          <Text style={styles.timeValue}>{record?.checkOutTime || '--:--'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  dateDot: {
    marginHorizontal: 5,
    color: '#cbd5e1',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timeBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 14,
  },
});
