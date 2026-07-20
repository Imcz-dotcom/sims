import { useMemo } from 'react';
import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import { pivotCount } from './chart-utils';
import type { SSD } from '@/lib/shared';

interface ModelPopularityChartProps {
  inventory: SSD[];
}

export default function ModelPopularityChart({ inventory }: ModelPopularityChartProps) {
  const { data, series } = useMemo(
    () => pivotCount(inventory, 'model', 'location'),
    [inventory],
  );

  return (
    <ChartCard
      title="Model Popularity"
      description="Most common SSD models, broken down by storage location."
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
