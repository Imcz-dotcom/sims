import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import type { DistributionItem } from './types';

interface LocationChartProps {
  data: DistributionItem[];
}

export default function LocationChart({ data }: LocationChartProps) {
  return (
    <ChartCard
      title="Inventory by Location"
      description="Number of registered drives at each site or storage area."
    >
      <BarChart
        h={350}
        data={data}
        dataKey="name"
        series={[{ name: 'count', label: 'SSDs', color: 'indigo.6' }]}
        tickLine="y"
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
