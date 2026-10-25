import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_USERS, getInitialAttendanceRecords } from '../data/dummyData';

const STORAGE_KEYS = {
  USERS: '@attendance_app_users_v1',
  RECORDS: '@attendance_app_records_v1',
  AUTH_SESSION: '@attendance_app_session_v1',
};

/**
 * Initializes AsyncStorage with predefined users and attendance if not present
 */
export const initAppStorage = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    let users = INITIAL_USERS;
    if (!existingUsers) {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    } else {
      users = JSON.parse(existingUsers);
    }

    const existingRecords = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
    let records = getInitialAttendanceRecords();
    if (!existingRecords) {
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } else {
      records = JSON.parse(existingRecords);
    }

    const savedSession = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    const authUser = savedSession ? JSON.parse(savedSession) : null;

    return {
      users,
      records,
      authUser,
    };
  } catch (error) {
    console.error('Error initializing AsyncStorage:', error);
    return {
      users: INITIAL_USERS,
      records: getInitialAttendanceRecords(),
      authUser: null,
    };
  }
};

export const saveUsersToStorage = async (users) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

export const saveRecordsToStorage = async (records) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving attendance records to storage:', error);
  }
};

export const saveSessionToStorage = async (user) => {
  try {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  } catch (error) {
    console.error('Error saving session to storage:', error);
  }
};

export const clearSessionFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};
