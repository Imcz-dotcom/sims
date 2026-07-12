import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import type { DistributionItem } from './types';

interface LocationChartProps {
  data: DistributionItem[];
}

export default function LocationChart({ data }: LocationChartProps) {
  return (
    <ChartCard title="Inventory by Location" description="Number of registered drives at each site or storage area.">
      <BarChart h={300} data={data} dataKey="name" series={[{ name: 'count', label: 'SSDs', color: 'indigo.6' }]} tickLine="y" withLegend legendProps={{ verticalAlign: 'top', align: 'right' }} />
    </ChartCard>
  );
}
