import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';

interface DistributionItem {
  name: string;
  count: number;
}

interface CapacityChartProps {
  data: DistributionItem[];
}

export default function CapacityChart({ data }: CapacityChartProps) {
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
