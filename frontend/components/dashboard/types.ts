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

export const chartColors = ['indigo.6', 'cyan.6', 'grape.6', 'orange.6', 'teal.6', 'pink.6'];

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
