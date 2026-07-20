import { useMemo } from 'react';
import { DonutChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import { chartColors, countBy } from './chart-utils';
import type { SSD } from '@/lib/shared';

interface InterfaceChartProps {
  inventory: SSD[];
}

export default function InterfaceChart({ inventory }: InterfaceChartProps) {
  const data = useMemo(
    () =>
      countBy(inventory, 'interface').map((item, index) => ({
        ...item,
        value: item.count,
        color: chartColors[index % chartColors.length],
      })),
    [inventory],
  );

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
