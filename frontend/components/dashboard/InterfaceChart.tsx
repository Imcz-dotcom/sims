import { DonutChart } from '@mantine/charts';
import ChartCard from './ChartCard';

interface InterfaceChartProps {
  data: { name: string; count: number; value: number; color: string }[];
}

export default function InterfaceChart({ data }: InterfaceChartProps) {
  return (
    <ChartCard
      title="Interface Breakdown"
      description="Share of SATA, NVMe, SAS, and other interfaces."
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
