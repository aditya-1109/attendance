import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarCheck,
  AlertCircle,
  LogIn,
  Shield,
  UserCheck,
  User,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, clearAuthError } from '../storage/authSlice';

export const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // Validate against stored dummy users
    setTimeout(() => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (user) {
        dispatch(loginSuccess(user));
        setIsSubmitting(false);
        navigation.replace('Dashboard');
      } else {
        setIsSubmitting(false);
        setErrorMessage('Invalid credentials. Please verify email and password.');
        dispatch(loginFailure('Invalid credentials.'));
      }
    }, 400);
  };

  const handleQuickFill = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setErrorMessage('');
    dispatch(clearAuthError());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        {...(Platform.OS === 'android' ? { backgroundColor: '#f8fafc' } : {})}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Logo & App Title */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <CalendarCheck size={32} color="#ffffff" strokeWidth={2.2} />
          </View>
          <Text style={styles.appName}>Attendance</Text>
          <Text style={styles.subtitle}>Sign in to access your dashboard</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Account Sign In</Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color="#dc2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" />
              <TextInput
                style={styles.input}
                placeholder="name@test.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  setErrorMessage('');
                }}
              />
            </View>
          </View>

          {/* Password Input with Eye Icon Toggle */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMessage('');
                }}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#64748b" />
                ) : (
                  <Eye size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isSubmitting && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Demo Credentials */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Quick Demo Logins</Text>
          <Text style={styles.demoSubtitle}>
            Tap any role to prefill credentials:
          </Text>

          <View style={styles.demoGrid}>
            {/* Admin Demo */}
            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#bfdbfe' }]}
              onPress={() => handleQuickFill('admin@test.com', 'Admin@123')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconBox, { backgroundColor: '#eff6ff' }]}>
                <Shield size={16} color="#2563eb" />
              </View>
              <View style={styles.demoCardContent}>
                <Text style={styles.demoRole}>Admin</Text>
                <Text style={styles.demoCreds}>admin@test.com</Text>
              </View>
            </TouchableOpacity>

            {/* Senior Staff Demo */}
            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#ddd6fe' }]}
              onPress={() => handleQuickFill('senior@test.com', 'Senior@123')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconBox, { backgroundColor: '#f5f3ff' }]}>
                <UserCheck size={16} color="#7c3aed" />
              </View>
              <View style={styles.demoCardContent}>
                <Text style={styles.demoRole}>Senior Staff</Text>
                <Text style={styles.demoCreds}>senior@test.com</Text>
              </View>
            </TouchableOpacity>

            {/* Staff Demo */}
            <TouchableOpacity
              style={[styles.demoCard, { borderColor: '#a7f3d0' }]}
              onPress={() => handleQuickFill('staff@test.com', 'Staff@123')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconBox, { backgroundColor: '#ecfdf5' }]}>
                <User size={16} color="#059669" />
              </View>
              <View style={styles.demoCardContent}>
                <Text style={styles.demoRole}>Staff</Text>
                <Text style={styles.demoCreds}>staff@test.com</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 14,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  demoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  demoSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  demoGrid: {
    gap: 10,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
  },
  demoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  demoCardContent: {
    flex: 1,
  },
  demoRole: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  demoCreds: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
