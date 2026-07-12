import { Paper, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Paper withBorder radius="xl" p="lg" shadow="xs">
      <Title order={4}>{title}</Title>
      <Text size="sm" c="dimmed" mb="lg">{description}</Text>
      {children}
    </Paper>
  );
}
