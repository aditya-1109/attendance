import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { CalendarCheck, ShieldCheck, Users } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { initAppStorage } from '../storage/asyncStorage';
import { restoreSession } from '../storage/authSlice';
import { setUsers } from '../storage/usersSlice';
import { setRecords } from '../storage/attendanceSlice';

export const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Initialize storage & seed predefined data
        const { users, records, authUser } = await initAppStorage();

        // Populate Redux state
        dispatch(setUsers(users));
        dispatch(setRecords(records));
        dispatch(restoreSession(authUser));

        // Smooth transition
        setTimeout(() => {
          if (authUser) {
            navigation.replace('Dashboard');
          } else {
            navigation.replace('Login');
          }
        }, 1200);
      } catch (error) {
        console.error('Bootstrap error:', error);
        navigation.replace('Login');
      }
    };

    bootstrap();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        {...(Platform.OS === 'android' ? { backgroundColor: '#0f172a' } : {})}
      />

      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <CalendarCheck size={42} color="#ffffff" strokeWidth={2.2} />
        </View>

        <Text style={styles.appName}>Attendance</Text>
        <Text style={styles.tagline}>Workforce & Attendance Management</Text>

        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <ShieldCheck size={14} color="#94a3b8" />
            <Text style={styles.featureText}>Role-Based Access</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <View style={styles.featureItem}>
            <Users size={14} color="#94a3b8" />
            <Text style={styles.featureText}>Live Tracking</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#6366f1" />
        <Text style={styles.loadingText}>Initializing system...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 140,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 24,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  featureText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  dot: {
    color: '#475569',
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
