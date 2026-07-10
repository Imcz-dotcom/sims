import {
  Title,
  Text,
  Table,
  Badge,
  Paper,
  Group,
  Button,
  TextInput,
  Stack,
} from '@mantine/core';
import Link from 'next/link';

const dummyInventory = [
  {
    id: 'SSD-001',
    model: 'Samsung 990 Pro',
    serial: 'S71DNU0W123456K',
    capacity: '2 TB',
    health: 98,
    status: 'Optimal',
  },
  {
    id: 'SSD-002',
    model: 'WD Black SN850X',
    serial: 'WDS200T2X0E-00B',
    capacity: '2 TB',
    health: 100,
    status: 'Optimal',
  },
  {
    id: 'SSD-003',
    model: 'Crucial T700',
    serial: 'CT1000T700SSD8',
    capacity: '1 TB',
    health: 92,
    status: 'Warning',
  },
  {
    id: 'SSD-004',
    model: 'Kingston KC3000',
    serial: 'SKC3000D/2048G',
    capacity: '2 TB',
    health: 85,
    status: 'Optimal',
  },
  {
    id: 'SSD-005',
    model: 'SanDisk Extreme Portable',
    serial: 'SDSSDE61-1T00-G25',
    capacity: '1 TB',
    health: 45,
    status: 'Critical',
  },
];

export default function Inventory() {
  const rows = dummyInventory.map((item) => {
    let statusColor = 'dark';
    if (item.status === 'Warning') statusColor = 'gray';
    if (item.status === 'Critical') statusColor = 'red'; // Keep red for critical errors, or we can use dark variants

    return (
      <Table.Tr key={item.id}>
        <Table.Td style={{ fontWeight: 600 }}>{item.id}</Table.Td>
        <Table.Td>{item.model}</Table.Td>
        <Table.Td style={{ fontFamily: 'monospace' }}>{item.serial}</Table.Td>
        <Table.Td>{item.capacity}</Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Text size="sm">{item.health}%</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Badge
            variant={item.status === 'Optimal' ? 'light' : 'filled'}
            color={statusColor}
            size="sm"
          >
            {item.status}
          </Badge>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="lg" maw={1000} mx="auto">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} style={{ letterSpacing: '-0.5px' }}>
            SSD Inventory Records
          </Title>
          <Text size="sm" c="dimmed">
            Browse, manage, and monitor all registered solid-state drives in the system.
          </Text>
        </div>
        <Button component={Link} href="/inventory/add" variant="filled" color="dark" radius="xl">
          Register New SSD
        </Button>
      </Group>

      <Paper shadow="sm" radius="xl" p="xl" withBorder>
        <Group mb="md">
          <TextInput
            placeholder="Search by serial number, model, or ID..."
            style={{ flex: 1 }}
            radius="md"
          />
        </Group>

        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Model Name</Table.Th>
                <Table.Th>Serial Number</Table.Th>
                <Table.Th>Capacity</Table.Th>
                <Table.Th>Health Status</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Stack>
  );
}
