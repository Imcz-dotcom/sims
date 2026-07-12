import { LineChart } from '@mantine/charts';
import ChartCard from './ChartCard';

interface AdditionsTrendChartProps {
  data: { date: string; count: number }[];
}

export default function AdditionsTrendChart({ data }: AdditionsTrendChartProps) {
  return (
    <ChartCard title="Recent Additions Trend" description="Number of SSD records registered on each date.">
      <LineChart h={300} data={data} dataKey="date" series={[{ name: 'count', label: 'SSDs added', color: 'teal.6' }]} curveType="linear" withLegend legendProps={{ verticalAlign: 'top', align: 'right' }} />
    </ChartCard>
  );
}
