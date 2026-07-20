import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import type { PivotResult } from './chart-utils';

interface LocationChartProps {
  data: PivotResult;
}

export default function LocationChart({ data }: LocationChartProps) {
  return (
    <ChartCard
      title="Inventory by Location"
      description="Drive models registered at each site or storage area."
    >
      <BarChart
        h={350}
        data={data.data}
        dataKey="name"
        type="stacked"
        series={data.series}
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
