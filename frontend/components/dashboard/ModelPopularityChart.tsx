import { BarChart } from '@mantine/charts';
import ChartCard from './ChartCard';
import type { PivotResult } from './chart-utils';

interface ModelPopularityChartProps {
  data: PivotResult;
}

export default function ModelPopularityChart({ data }: ModelPopularityChartProps) {
  return (
    <ChartCard
      title="Model Popularity"
      description="Most common SSD models, broken down by storage location."
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
