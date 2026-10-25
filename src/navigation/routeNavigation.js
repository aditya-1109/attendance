import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/splash';
import { LoginScreen } from '../screens/login';
import { DashboardScreen } from '../screens/dashboard';
import { AttendanceHistoryScreen } from '../screens/attendanceHistory';
import { AttendanceRecordsScreen } from '../screens/attendanceRecords';
import { UserManagementScreen } from '../screens/userManagement';

const Stack = createNativeStackNavigator();

export const RouteNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#f8fafc' },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="AttendanceHistory"
        component={AttendanceHistoryScreen}
      />
      <Stack.Screen
        name="AttendanceRecords"
        component={AttendanceRecordsScreen}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
      />
    </Stack.Navigator>
  );
};

export default RouteNavigation;
