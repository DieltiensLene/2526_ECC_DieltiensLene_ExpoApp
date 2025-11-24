import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

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
  const now = new Date();
  // optionally lock to September 2025 to match screenshot — use current month by default
  const year = now.getFullYear();
  const month = now.getMonth();

  const grid = useMemo(() => generateMonthGrid(year, month), [year, month]);

  // example event dots; replace with real data when available
  const events: Record<number, ('pink' | 'green')[]> = {
    1: ['green', 'pink'],
    2: ['pink'],
    3: ['pink'],
    13: ['green'],
    24: ['pink'],
    19: ['green'],
  };

  const monthLabel = now.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.monthText}>{monthLabel.toUpperCase()}</ThemedText>
      </View>

      <View style={styles.weekdaysRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
          <ThemedText key={d} style={styles.weekday}>{d}</ThemedText>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, idx) => (
          <View key={String(idx)} style={styles.cell}>
            {day ? (
              <>
                <ThemedText style={[styles.dayNumber, day === now.getDate() && styles.today]}>{day}</ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 16, paddingBottom: 8, alignItems: 'center' },
  monthText: { fontSize: 18, fontWeight: '700', color: '#FF2D86' },
  weekdaysRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12, paddingVertical: 8 },
  weekday: { color: '#FF2D86', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  cell: { width: `${100 / 7}%`, height: 56, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { fontSize: 14, color: '#111' },
  today: { color: '#FF2D86', fontWeight: '700' },
  dotsRow: { flexDirection: 'row', marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
  dotPink: { backgroundColor: '#FF2D86' },
  dotGreen: { backgroundColor: '#2BB673' },
});
