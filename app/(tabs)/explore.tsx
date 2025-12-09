import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useFocusEffect } from '@react-navigation/native';
import { getItem } from '@/app/utils/storage';

type Entry = {
  id: string;
  type: 'rose' | 'thorn';
  message: string;
  createdAt: string;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function formatEntryDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = date.getDate();
  const month = monthNames[date.getMonth()] ?? '';
  return `${day} ${month}`;
}

function getEventColor(type: Entry['type']): 'pink' | 'green' {
  return type === 'rose' ? 'pink' : 'green';
}

function generateMonthGrid(year: number, month: number) {
  // month: 0-indexed (0 = Jan)
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = first.getDay(); // 0 = Sun .. 6 = Sat

  const grid: (number | null)[] = [];
  // convert to Monday-first index like the screenshot (M=0)
  const leading = (startDay + 6) % 7; // shift so Monday=0

  for (let i = 0; i < leading; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export default function AgendaScreen() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const saved = await getItem('entries');
          if (!active) return;
          if (saved) {
            const parsed: Entry[] = JSON.parse(saved);
            parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setEntries(parsed);
          } else {
            setEntries([]);
          }
        } catch (error) {
          console.warn('Failed to load entries', error);
          if (active) setEntries([]);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const grid = useMemo(() => generateMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  const events = useMemo(() => {
    const map: Record<number, ('pink' | 'green')[]> = {};
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      if (
        date.getFullYear() === viewDate.getFullYear() &&
        date.getMonth() === viewDate.getMonth()
      ) {
        const day = date.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(getEventColor(entry.type));
      }
    });
    return map;
  }, [entries, viewDate]);

  const monthLabel = viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  function prevMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowButton} accessibilityLabel="Previous month">
          <ThemedText style={styles.arrowText}>{'<'}</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.monthText}>{monthLabel.toUpperCase()}</ThemedText>

        <TouchableOpacity onPress={nextMonth} style={styles.arrowButton} accessibilityLabel="Next month">
          <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdaysRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
          <ThemedText key={d + 'day' + index} style={styles.weekday}>{d}</ThemedText>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, idx) => (
          <View key={String(idx)} style={styles.cell}>
            {day ? (
              <>
                <ThemedText style={[
                  styles.dayNumber,
                  day === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear() ? styles.today : undefined,
                ]}>{day}</ThemedText>
                <View style={styles.dotsRow}>
                  {(events[day] || []).slice(0, 3).map((c, i) => (
                    <View key={i} style={[styles.dot, c === 'pink' ? styles.dotPink : styles.dotGreen]} />
                  ))}
                </View>
              </>
            ) : null}
          </View>
        ))}
      </View>
      <ScrollView style={styles.entriesScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <ThemedText style={styles.emptyState}>No roses or thorns saved yet. Tap Add to create one.</ThemedText>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View
                style={[
                  styles.entryPill,
                  entry.type === 'rose' ? styles.pillRose : styles.pillThorn,
                ]}
              />
              <View style={styles.entryBody}>
                <View style={styles.entryHeader}>
                  <ThemedText style={styles.entryDate}>{formatEntryDate(entry.createdAt)}</ThemedText>
                  <View style={[styles.entryBadge, entry.type === 'rose' ? styles.badgeRose : styles.badgeThorn]}>
                    <ThemedText style={styles.badgeText}>{entry.type === 'rose' ? 'Rose' : 'Thorn'}</ThemedText>
                  </View>
                </View>
                <ThemedText numberOfLines={2} style={styles.entryMessage}>{entry.message}</ThemedText>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { paddingTop: 16, paddingBottom: 8, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 8 },
  arrowButton: { padding: 8 },
  arrowText: { fontSize: 20, color: '#FF2D86', fontWeight: '700' },
  monthText: { fontSize: 18, fontWeight: '700', color: '#FF2D86' },
  weekdaysRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12, paddingVertical: 8 },
  weekday: { color: '#FF2D86', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 8 },
  cell: { width: `${100 / 7}%`, height: 56, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { fontSize: 14, color: '#111' },
  today: { color: '#FF2D86', fontWeight: '700' },
  dotsRow: { flexDirection: 'row', marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
  dotPink: { backgroundColor: '#FF2D86' },
  dotGreen: { backgroundColor: '#2BB673' },
  entriesScroll: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 80 },
  emptyState: { textAlign: 'center', color: '#9AA0A6', marginTop: 16, fontSize: 14 },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  entryPill: { width: 6, alignSelf: 'stretch', borderRadius: 999 },
  pillRose: { backgroundColor: '#FF5C93' },
  pillThorn: { backgroundColor: '#2BB673' },
  entryBody: { flex: 1, marginLeft: 12 },
  entryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  entryDate: { fontSize: 18, fontWeight: '700', color: '#111' },
  entryBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F4F4F4',
  },
  badgeRose: { backgroundColor: 'rgba(255,92,147,0.15)' },
  badgeThorn: { backgroundColor: 'rgba(43,182,115,0.15)' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#555' },
  entryMessage: { marginTop: 8, fontSize: 14, color: '#444' },
});
