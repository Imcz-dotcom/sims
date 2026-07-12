import { Alert, Badge, Group, Paper, Table, Text, Title } from '@mantine/core';
import type { SSD } from './types';

interface NeedsAttentionTableProps {
  data: SSD[];
}

export default function NeedsAttentionTable({ data }: NeedsAttentionTableProps) {
  return (
    <Paper withBorder radius="xl" p="lg" shadow="xs">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={4}>Needs Attention</Title>
          <Text size="sm" c="dimmed">Failed drives that may require replacement.</Text>
        </div>
        <Badge color={data.length ? 'red' : 'green'} variant="light">
          {data.length} failed
        </Badge>
      </Group>
      {data.length === 0 ? (
        <Alert color="green">No failed SSDs. All drives are operational or available.</Alert>
      ) : (
        <Table.ScrollContainer minWidth={520}>
          <Table verticalSpacing="sm">
            <Table.Thead><Table.Tr><Table.Th>Device</Table.Th><Table.Th>Serial</Table.Th><Table.Th>Location</Table.Th><Table.Th>Status</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {data.map((item) => (
                <Table.Tr key={item._id}>
                  <Table.Td fw={600}>{item.deviceId}</Table.Td>
                  <Table.Td ff="monospace">{item.serialNumber}</Table.Td>
                  <Table.Td>{item.location}</Table.Td>
                  <Table.Td><Badge color="red">Failed</Badge></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Paper>
  );
}
