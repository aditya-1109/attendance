import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CalendarX, Calendar, Clock, CheckCircle2 } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { Header } from '../components/Header';
import { AttendanceItem } from '../components/AttendanceItem';

export const AttendanceHistoryScreen = ({ navigation }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { records } = useSelector((state) => state.attendance);

  // Filter records belonging to the logged-in user and sort by date descending
  const userRecords = records
    .filter((r) => r.userId === currentUser?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate personal metrics
  const totalDays = userRecords.length;
  const completedDays = userRecords.filter((r) => r.status === 'checked_out').length;

  return (
    <View style={styles.screen}>
      <Header
        title="Attendance History"
        subtitle={`Records for ${currentUser?.name || 'You'}`}
        showBack={true}
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Summary banner */}
        <View style={styles.statsBanner}>
          <View style={styles.bannerItem}>
            <Calendar size={16} color="#4f46e5" />
            <Text style={styles.bannerLabel}>Total Logged:</Text>
            <Text style={styles.bannerVal}>{totalDays} Days</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerItem}>
            <CheckCircle2 size={16} color="#16a34a" />
            <Text style={styles.bannerLabel}>Completed:</Text>
            <Text style={styles.bannerVal}>{completedDays} Days</Text>
          </View>
        </View>

        {/* Attendance List */}
        <FlatList
          data={userRecords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AttendanceItem record={item} user={currentUser} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <CalendarX size={32} color="#94a3b8" />
              </View>
              <Text style={styles.emptyTitle}>No Attendance Records Found</Text>
              <Text style={styles.emptySubtitle}>
                You haven't recorded any attendance logs yet. Check in from your
                dashboard to begin tracking.
              </Text>
            </View>
          }
        />
      </View>
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
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  bannerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  bannerVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  bannerDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 40,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
