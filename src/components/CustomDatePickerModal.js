import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Calendar,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarCheck,
} from 'lucide-react-native';

export const CustomDatePickerModal = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  title = 'Select Date',
}) => {
  // Parse initial date or default to current date
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
    }
    return new Date();
  };

  const [currentMonthDate, setCurrentMonthDate] = useState(
    parseDate(selectedDate)
  );
  const [tempSelectedDate, setTempSelectedDate] = useState(
    selectedDate || new Date().toISOString().split('T')[0]
  );

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const formatDateStr = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDayPress = (day) => {
    if (!day) return;
    const formatted = formatDateStr(year, month, day);
    setTempSelectedDate(formatted);
  };

  const handleConfirm = () => {
    onSelectDate(tempSelectedDate);
    onClose();
  };

  const handleSelectToday = () => {
    const today = new Date();
    setCurrentMonthDate(today);
    setTempSelectedDate(todayStr);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Calendar size={18} color="#4f46e5" />
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Month / Year Navigator */}
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={handlePrevMonth}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color="#334155" />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {months[month]} {year}
            </Text>

            <TouchableOpacity
              style={styles.navBtn}
              onPress={handleNextMonth}
              activeOpacity={0.7}
            >
              <ChevronRight size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {/* Quick Shortcuts */}
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              style={[
                styles.shortcutBtn,
                tempSelectedDate === todayStr && styles.shortcutBtnActive,
              ]}
              onPress={handleSelectToday}
              activeOpacity={0.7}
            >
              <CalendarCheck
                size={14}
                color={tempSelectedDate === todayStr ? '#4f46e5' : '#64748b'}
              />
              <Text
                style={[
                  styles.shortcutText,
                  tempSelectedDate === todayStr && styles.shortcutTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weekday Labels */}
          <View style={styles.weekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w, index) => (
              <Text key={index} style={styles.weekDay}>
                {w}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.grid}>
            {daysArray.map((day, index) => {
              if (day === null) {
                return <View key={index} style={styles.emptyDay} />;
              }
              const dStr = formatDateStr(year, month, day);
              const isSelected = tempSelectedDate === dStr;
              const isToday = todayStr === dStr;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    !isSelected && isToday && styles.dayCellToday,
                  ]}
                  onPress={() => handleDayPress(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      !isSelected && isToday && styles.dayTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Date Summary */}
          <View style={styles.selectionSummary}>
            <Clock size={15} color="#64748b" />
            <Text style={styles.summaryText}>
              Selected: <Text style={styles.summaryBold}>{tempSelectedDate}</Text>
            </Text>
          </View>

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
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.confirmText}>Apply Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  navBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  shortcutBtnActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  shortcutTextActive: {
    color: '#4f46e5',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekDay: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
  },
  emptyDay: {
    width: 38,
    height: 38,
  },
  dayCell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  dayCellSelected: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  dayTextToday: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 13,
    color: '#64748b',
  },
  summaryBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  confirmBtn: {
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
