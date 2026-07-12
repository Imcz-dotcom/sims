import { DonutChart } from '@mantine/charts';
import ChartCard from './ChartCard';

interface StatusOverviewChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function StatusOverviewChart({ data }: StatusOverviewChartProps) {
  return (
    <ChartCard
      title="Status Overview"
      description="Current health and availability across all SSDs."
    >
      <DonutChart
        h={300}
        data={data}
        withLabels
        withLabelsLine
        tooltipDataSource="segment"
        withLegend
        legendProps={{ verticalAlign: 'top', align: 'right' }}
      />
    </ChartCard>
  );
}
