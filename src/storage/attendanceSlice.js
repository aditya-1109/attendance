import { createSlice } from '@reduxjs/toolkit';
import { saveRecordsToStorage } from './asyncStorage';

const initialState = {
  records: [],
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    recordCheckIn: (state, action) => {
      const { userId, date, checkInTime } = action.payload;
      // Check if user already has record for this date
      const existingIndex = state.records.findIndex(
        (r) => r.userId === userId && r.date === date
      );

      if (existingIndex !== -1) {
        state.records[existingIndex].checkInTime = checkInTime;
        state.records[existingIndex].status = 'checked_in';
      } else {
        const newRecord = {
          id: `att_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          userId,
          date,
          checkInTime,
          checkOutTime: null,
          status: 'checked_in',
        };
        state.records.unshift(newRecord);
      }
      saveRecordsToStorage(state.records);
    },
    recordCheckOut: (state, action) => {
      const { userId, date, checkOutTime } = action.payload;
      const existingIndex = state.records.findIndex(
        (r) => r.userId === userId && r.date === date
      );

      if (existingIndex !== -1) {
        state.records[existingIndex].checkOutTime = checkOutTime;
        state.records[existingIndex].status = 'checked_out';
        saveRecordsToStorage(state.records);
      }
    },
    markAttendanceByDate: (state, action) => {
      const { userId, date, checkInTime, checkOutTime, status } = action.payload;
      const existingIndex = state.records.findIndex(
        (r) => r.userId === userId && r.date === date
      );

      if (existingIndex !== -1) {
        state.records[existingIndex] = {
          ...state.records[existingIndex],
          checkInTime: checkInTime || state.records[existingIndex].checkInTime,
          checkOutTime: checkOutTime !== undefined ? checkOutTime : state.records[existingIndex].checkOutTime,
          status: status || state.records[existingIndex].status,
        };
      } else {
        state.records.unshift({
          id: `att_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          userId,
          date,
          checkInTime: checkInTime || '09:00 AM',
          checkOutTime: checkOutTime || null,
          status: status || (checkOutTime ? 'checked_out' : 'checked_in'),
        });
      }
      saveRecordsToStorage(state.records);
    },
  },
});

export const {
  setRecords,
  recordCheckIn,
  recordCheckOut,
  markAttendanceByDate,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
