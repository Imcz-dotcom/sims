export interface SSD {
  _id: string;
  deviceId: string;
  model: string;
  serialNumber: string;
  capacity: string;
  interface: string;
  status: 'Active' | 'Available' | 'Failed';
  location: string;
  createdAt: string;
}

export interface DistributionItem {
  name: string;
  count: number;
}

export const statusMeta = {
  Active: { color: 'green.6', badge: 'green' },
  Available: { color: 'blue.6', badge: 'blue' },
  Failed: { color: 'red.6', badge: 'red' },
};

export const chartColors = [
  'red.6',
  'cyan.6',
  'orange.6',
  'blue.6',
  'yellow.6',
  'indigo.6',
  'lime.6',
  'violet.6',
  'green.6',
  'grape.6',
  'teal.6',
  'pink.6',
  'red.8',
  'cyan.8',
  'orange.8',
  'blue.8',
  'yellow.8',
  'indigo.8',
  'lime.8',
  'violet.8',
  'green.8',
  'grape.8',
  'teal.8',
  'pink.8',
];

export function countBy(items: SSD[], key: keyof SSD): DistributionItem[] {
  const counts = items.reduce<Record<string, number>>((result, item) => {
    const value = String(item[key] || 'Unknown');
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export interface StackedSeries {
  name: string;
  color: string;
}

export interface PivotResult {
  data: Array<Record<string, string | number>>;
  series: StackedSeries[];
}

export function pivotCount(items: SSD[], groupKey: keyof SSD, seriesKey: keyof SSD): PivotResult {
  const groupTotals = new Map<string, number>();
  const seriesKeys = new Set<string>();
  const table = new Map<string, Record<string, number>>();

  items.forEach((item) => {
    const group = String(item[groupKey] || 'Unknown');
    const series = String(item[seriesKey] || 'Unknown');
    seriesKeys.add(series);

    if (!table.has(group)) {
      table.set(group, {});
    }
    const row = table.get(group)!;
    row[series] = (row[series] || 0) + 1;
    groupTotals.set(group, (groupTotals.get(group) || 0) + 1);
  });

  const sortedGroups = Array.from(groupTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([group]) => group);

  const data = sortedGroups.map((group) => ({ name: group, ...table.get(group) }));

  const series = Array.from(seriesKeys)
    .sort()
    .map((name, index) => ({ name, color: chartColors[index % chartColors.length] }));

  return { data, series };
}
