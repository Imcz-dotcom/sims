import { Group, Paper, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ChartCard({ title, description, action, children }: ChartCardProps) {
  return (
    <Paper withBorder radius="xl" p="lg" shadow="xs">
      <Group justify="space-between" align="flex-start">
        <Title order={4}>{title}</Title>
        {action}
      </Group>
      <Text size="sm" c="dimmed" mb="lg">
        {description}
      </Text>
      {children}
    </Paper>
  );
}
