import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  X,
  User,
  Mail,
  Lock,
  Briefcase,
  Shield,
  UserCheck,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react-native';

export const UserModal = ({ visible, onClose, onSave, initialData }) => {
  const isEditing = !!initialData;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('staff');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPassword(initialData.password || '');
      setRole(initialData.role || 'staff');
      setDepartment(initialData.department || '');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('staff');
      setDepartment('');
    }
    setError('');
    setShowPassword(false);
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter employee name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isEditing && (!password || password.length < 4)) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    const userData = {
      ...(initialData || {}),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department: department.trim() || 'General Operations',
    };

    if (!isEditing) {
      userData.id = `usr_${Date.now()}`;
      userData.password = password;
      userData.createdAt = new Date().toISOString().split('T')[0];
    } else if (password) {
      userData.password = password;
    }

    onSave(userData);
    onClose();
  };

  const roles = [
    { id: 'admin', label: 'Admin', Icon: Shield },
    { id: 'senior_staff', label: 'Senior Staff', Icon: UserCheck },
    { id: 'staff', label: 'Staff', Icon: User },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color="#94a3b8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    setError('');
                  }}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color="#94a3b8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. john@test.com"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setError('');
                  }}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
              </Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#94a3b8" />
                <TextInput
                  style={styles.input}
                  placeholder={isEditing ? '••••••••' : 'Enter password'}
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    setError('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  style={styles.eyeBtn}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Department */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <View style={styles.inputWrapper}>
                <Briefcase size={18} color="#94a3b8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Engineering, Sales, QA"
                  placeholderTextColor="#94a3b8"
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assigned Role</Text>
              <View style={styles.roleGrid}>
                {roles.map((r) => {
                  const isSelected = role === r.id;
                  const Icon = r.Icon;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[
                        styles.roleChip,
                        isSelected && styles.roleChipActive,
                      ]}
                      onPress={() => setRole(r.id)}
                      activeOpacity={0.7}
                    >
                      <Icon
                        size={16}
                        color={isSelected ? '#ffffff' : '#64748b'}
                      />
                      <Text
                        style={[
                          styles.roleChipText,
                          isSelected && styles.roleChipTextActive,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.submitText}>
                {isEditing ? 'Save Changes' : 'Create User'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  errorBox: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    padding: 20,
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
  roleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  roleChipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  roleChipTextActive: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#4f46e5',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
