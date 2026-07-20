import { useMemo } from 'react';
import { Card, SimpleGrid, Text } from '@mantine/core';
import type { SSD } from '@/lib/shared';

interface SummaryCardsProps {
  inventory: SSD[];
}

export default function SummaryCards({ inventory }: SummaryCardsProps) {
  const counts = useMemo(() => {
    const statusCounts = {
      Active: inventory.filter((item) => item.status === 'Active').length,
      Available: inventory.filter((item) => item.status === 'Available').length,
      Failed: inventory.filter((item) => item.status === 'Failed').length,
    };
    return {
      total: inventory.length,
      ...statusCounts,
    };
  }, [inventory]);

  const summaryCards = [
    { label: 'Total SSDs', value: counts.total, color: 'dark' },
    { label: 'Active', value: counts.Active, color: 'green' },
    { label: 'Available', value: counts.Available, color: 'blue' },
    { label: 'Failed', value: counts.Failed, color: 'red' },
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
