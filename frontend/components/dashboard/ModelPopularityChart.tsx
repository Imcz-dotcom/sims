import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import type { DistributionItem } from './types';

interface ModelPopularityChartProps {
  data: DistributionItem[];
}

export default function ModelPopularityChart({ data }: ModelPopularityChartProps) {
  return (
    <ChartCard
      title="Model Popularity"
      description="Most common SSD models in the current inventory."
    >
      <BarChart
        h={300}
        data={data}
        dataKey="name"
        series={[{ name: 'count', label: 'SSDs', color: 'grape.6' }]}
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
