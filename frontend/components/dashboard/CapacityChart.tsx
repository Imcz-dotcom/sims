import { useMemo } from 'react';
import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import { countBy } from './chart-utils';
import type { SSD } from '@/lib/shared';

interface CapacityChartProps {
  inventory: SSD[];
}

export default function CapacityChart({ inventory }: CapacityChartProps) {
  const data = useMemo(() => countBy(inventory, 'capacity'), [inventory]);

  return (
    <ChartCard
      title="Capacity Distribution"
      description="Inventory grouped by advertised storage capacity."
    >
      <BarChart
        h={300}
        data={data}
        dataKey="name"
        series={[{ name: 'count', label: 'SSDs', color: 'cyan.6' }]}
        tickLine="y"
        withLegend
        legendProps={{ verticalAlign: 'top', align: 'right' }}
      />
    </ChartCard>
  );
}
