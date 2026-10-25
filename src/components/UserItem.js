import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pencil, Trash2, Shield, UserCheck, User, Mail, Briefcase } from 'lucide-react-native';

export const UserItem = ({ user, onEdit, onDelete, isCurrentUser }) => {
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

  const badge = getRoleBadge(user.role);
  const RoleIcon = badge.Icon;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.infoRow}>
            <Mail size={12} color="#64748b" />
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View
          style={[
            styles.roleBadge,
            { backgroundColor: badge.bgColor, borderColor: badge.borderColor },
          ]}
        >
          <RoleIcon size={12} color={badge.textColor} />
          <Text style={[styles.roleText, { color: badge.textColor }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.deptBlock}>
          <Briefcase size={12} color="#94a3b8" />
          <Text style={styles.deptText}>
            {user.department || 'General Workforce'}
          </Text>
          <Text style={styles.idText}>• ID: {user.id}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(user)}
            activeOpacity={0.7}
          >
            <Pencil size={15} color="#2563eb" />
          </TouchableOpacity>

          {!isCurrentUser && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(user)}
              activeOpacity={0.7}
            >
              <Trash2 size={15} color="#dc2626" />
            </TouchableOpacity>
          )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nameBlock: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  deptBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  deptText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  idText: {
    fontSize: 11,
    color: '#94a3b8',
    marginLeft: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  deleteBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});
