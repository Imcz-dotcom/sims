import { useMemo } from 'react';
import { DonutChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import { statusMeta, type SSD } from '@/lib/shared';

interface StatusOverviewChartProps {
  inventory: SSD[];
}

export default function StatusOverviewChart({ inventory }: StatusOverviewChartProps) {
  const data = useMemo(() => {
    const statusCounts = {
      Active: inventory.filter((item) => item.status === 'Active').length,
      Available: inventory.filter((item) => item.status === 'Available').length,
      Failed: inventory.filter((item) => item.status === 'Failed').length,
    };

    return (Object.keys(statusCounts) as Array<keyof typeof statusCounts>).map((status) => ({
      name: status,
      value: statusCounts[status],
      color: statusMeta[status].color,
    }));
  }, [inventory]);

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
