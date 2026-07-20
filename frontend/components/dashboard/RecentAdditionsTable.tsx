import { useMemo } from 'react';
import { Badge, Button, Group, Paper, ScrollArea, Table, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { statusMeta, type SSD } from '@/lib/shared';

interface RecentAdditionsTableProps {
  inventory: SSD[];
}

export default function RecentAdditionsTable({ inventory }: RecentAdditionsTableProps) {
  const data = useMemo(
    () =>
      [...inventory]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
        )
        .slice(0, 6),
    [inventory],
  );

  return (
    <Paper withBorder radius="xl" p="lg" shadow="xs">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={4}>Recent Additions</Title>
          <Text size="sm" c="dimmed">
            The latest SSDs registered in the system.
          </Text>
        </div>
        <Button component={Link} href="/inventory" variant="subtle" size="xs">
          View all
        </Button>
      </Group>
      <ScrollArea h={300}>
        <Table.ScrollContainer minWidth={520}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Device</Table.Th>
                <Table.Th>Model</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Added</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((item) => (
                <Table.Tr key={item._id}>
                  <Table.Td fw={600}>{item.deviceId}</Table.Td>
                  <Table.Td>{item.model}</Table.Td>
                  <Table.Td>
                    <Badge color={statusMeta[item.status].badge} variant="light">
                      {item.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>
    </Paper>
  );
}
