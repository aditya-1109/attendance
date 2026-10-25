import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  UserPlus,
  Search,
  X,
  Users,
  Shield,
  UserCheck,
  User,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../components/Header';
import { UserItem } from '../components/UserItem';
import { UserModal } from '../components/UserModal';
import { addUser, updateUser, deleteUser } from '../storage/usersSlice';

export const UserManagementScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Search filter
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  // Open modal for Create
  const handleAddNew = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  // Open modal for Edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  // Delete User Confirmation
  const handleDelete = (user) => {
    if (user.id === currentUser?.id) {
      Alert.alert('Restricted Action', 'You cannot delete your own logged-in account.');
      return;
    }

    Alert.alert(
      'Delete User',
      `Are you sure you want to permanently delete ${user.name}? This will remove them from the system.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteUser(user.id));
          },
        },
      ]
    );
  };

  // Save (Create or Update)
  const handleSaveUser = (userData) => {
    if (editingUser) {
      dispatch(updateUser(userData));
    } else {
      dispatch(addUser(userData));
    }
  };

  // Summary counts
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const seniorCount = users.filter((u) => u.role === 'senior_staff').length;
  const staffCount = users.filter((u) => u.role === 'staff').length;

  return (
    <View style={styles.screen}>
      <Header
        title="User Management"
        subtitle="Manage organization employees"
        showBack={true}
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Metric summary chips */}
        <View style={styles.statsStrip}>
          <View style={styles.statChip}>
            <Users size={13} color="#4f46e5" />
            <Text style={styles.statLabel}>Total: {totalCount}</Text>
          </View>
          <View style={styles.statChip}>
            <Shield size={13} color="#2563eb" />
            <Text style={styles.statLabel}>Admins: {adminCount}</Text>
          </View>
          <View style={styles.statChip}>
            <UserCheck size={13} color="#7c3aed" />
            <Text style={styles.statLabel}>Senior: {seniorCount}</Text>
          </View>
          <View style={styles.statChip}>
            <User size={13} color="#059669" />
            <Text style={styles.statLabel}>Staff: {staffCount}</Text>
          </View>
        </View>

        {/* Search Bar + Add User Button */}
        <View style={styles.actionRow}>
          <View style={styles.searchWrapper}>
            <Search size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, department..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddNew}
            activeOpacity={0.8}
          >
            <UserPlus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Add User</Text>
          </TouchableOpacity>
        </View>

        {/* User List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isCurrentUser={item.id === currentUser?.id}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={32} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Users Found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different search term or add a new user to the system.
              </Text>
            </View>
          }
        />
      </View>

      {/* User Create / Edit Modal */}
      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveUser}
        initialData={editingUser}
      />
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
  statsStrip: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4f46e5',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
