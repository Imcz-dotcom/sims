import { useMemo } from 'react';
import { LineChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import type { SSD } from '@/lib/shared';

interface AdditionsTrendChartProps {
  inventory: SSD[];
}

export default function AdditionsTrendChart({ inventory }: AdditionsTrendChartProps) {
  const data = useMemo(() => {
    const additions = inventory.reduce<Record<string, number>>((result, item) => {
      const date = item.createdAt ? item.createdAt.slice(0, 10) : 'Unknown';
      result[date] = (result[date] || 0) + 1;
      return result;
    }, {});

    return Object.entries(additions)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([date, count]) => ({
        date:
          date === 'Unknown'
            ? date
            : new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              }),
        count,
      }));
  }, [inventory]);

  return (
    <ChartCard
      title="Recent Additions Trend"
      description="Number of SSD records registered on each date."
    >
      <LineChart
        h={300}
        data={data}
        dataKey="date"
        series={[{ name: 'count', label: 'SSDs added', color: 'teal.6' }]}
        curveType="linear"
        withLegend
        legendProps={{ verticalAlign: 'top', align: 'right' }}
      />
    </ChartCard>
  );
}
