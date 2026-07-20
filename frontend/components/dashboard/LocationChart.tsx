import { useMemo } from 'react';
import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import { pivotCount } from './chart-utils';
import type { SSD } from '@/lib/shared';

interface LocationChartProps {
  inventory: SSD[];
}

export default function LocationChart({ inventory }: LocationChartProps) {
  const { data, series } = useMemo(
    () => pivotCount(inventory, 'location', 'model'),
    [inventory],
  );

  return (
    <ChartCard
      title="Inventory by Location"
      description="Drive models registered at each site or storage area."
    >
      <BarChart
        h={350}
        data={data}
        dataKey="name"
        type="stacked"
        series={series}
        tickLine="y"
        withLegend
        legendProps={{ verticalAlign: 'top', align: 'right' }}
        xAxisProps={{
          angle: -45,
          textAnchor: 'end',
          interval: 0,
          height: 80,
          tick: { fontSize: 10 },
        }}
      />
    </ChartCard>
  );
}
