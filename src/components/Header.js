import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogOut, ArrowLeft, Shield, UserCheck, User } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../storage/authSlice';

export const Header = ({ title, subtitle, showBack, navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          bgColor: '#eff6ff',
          textColor: '#2563eb',
          borderColor: '#bfdbfe',
          Icon: Shield,
        };
      case 'senior_staff':
        return {
          label: 'Senior Staff',
          bgColor: '#f5f3ff',
          textColor: '#7c3aed',
          borderColor: '#ddd6fe',
          Icon: UserCheck,
        };
      default:
        return {
          label: 'Staff',
          bgColor: '#ecfdf5',
          textColor: '#059669',
          borderColor: '#a7f3d0',
          Icon: User,
        };
    }
  };

  const badge = currentUser ? getRoleBadge(currentUser.role) : null;
  const RoleIcon = badge ? badge.Icon : null;

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && navigation ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#0f172a" />
          </TouchableOpacity>
        ) : null}

        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {badge && RoleIcon && (
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: badge.bgColor,
                borderColor: badge.borderColor,
              },
            ]}
          >
            <RoleIcon size={12} color={badge.textColor} />
            <Text style={[styles.roleText, { color: badge.textColor }]}>
              {badge.label}
            </Text>
          </View>
        )}

        {currentUser && (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => dispatch(logout())}
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#dc2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});
