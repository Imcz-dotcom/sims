import { Card, SimpleGrid, Text } from '@mantine/core';

interface SummaryCardsProps {
  total: number;
  active: number;
  available: number;
  failed: number;
}

export default function SummaryCards({ total, active, available, failed }: SummaryCardsProps) {
  const summaryCards = [
    { label: 'Total SSDs', value: total, color: 'dark' },
    { label: 'Active', value: active, color: 'green' },
    { label: 'Available', value: available, color: 'blue' },
    { label: 'Failed', value: failed, color: 'red' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
      {summaryCards.map((item) => (
        <Card key={item.label} withBorder radius="xl" p="lg" shadow="xs">
          <Text size="sm" c="dimmed" fw={500}>
            {item.label}
          </Text>
          <Text fz={32} fw={700} c={item.color}>
            {item.value}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
