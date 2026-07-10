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
    interfaceType: 'NVMe PCIe 4.0',
    status: 'Active',
    location: 'Rack A, Bay 3',
  },
  {
    id: 'SSD-002',
    model: 'WD Black SN850X',
    serial: 'WDS200T2X0E-00B',
    capacity: '2 TB',
    interfaceType: 'NVMe PCIe 4.0',
    status: 'Available',
    location: 'Stockroom Shelf 2',
  },
  {
    id: 'SSD-003',
    model: 'Crucial MX500',
    serial: 'CT1000MX500SSD1',
    capacity: '1 TB',
    interfaceType: 'SATA III',
    status: 'Failed',
    location: 'Rack B, Bay 1',
  },
  {
    id: 'SSD-004',
    model: 'Kingston KC3000',
    serial: 'SKC3000D/2048G',
    capacity: '2 TB',
    interfaceType: 'NVMe PCIe 4.0',
    status: 'Active',
    location: 'Rack A, Bay 4',
  },
  {
    id: 'SSD-005',
    model: 'Crucial T700',
    serial: 'CT2000T700SSD5',
    capacity: '2 TB',
    interfaceType: 'NVMe PCIe 5.0',
    status: 'Available',
    location: 'Stockroom Shelf 2',
  },
];

export default function Inventory() {
  const rows = dummyInventory.map((item) => {
    let statusColor = 'dark';
    if (item.status === 'Active') statusColor = 'dark';
    if (item.status === 'Available') statusColor = 'gray';
    if (item.status === 'Failed') statusColor = 'red';

    return (
      <Table.Tr key={item.id}>
        <Table.Td style={{ fontWeight: 600 }}>{item.id}</Table.Td>
        <Table.Td>{item.model}</Table.Td>
        <Table.Td style={{ fontFamily: 'monospace' }}>{item.serial}</Table.Td>
        <Table.Td>{item.capacity}</Table.Td>
        <Table.Td>{item.interfaceType}</Table.Td>
        <Table.Td>{item.location}</Table.Td>
        <Table.Td>
          <Badge
            variant={item.status === 'Active' ? 'filled' : item.status === 'Available' ? 'light' : 'outline'}
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
    <Stack gap="lg" maw={1100} mx="auto">
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
            placeholder="Search by serial number, model, location or ID..."
            style={{ flex: 1 }}
            radius="md"
          />
        </Group>

        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Device ID</Table.Th>
                <Table.Th>Model</Table.Th>
                <Table.Th>Serial Number</Table.Th>
                <Table.Th>Capacity</Table.Th>
                <Table.Th>Interface</Table.Th>
                <Table.Th>Location</Table.Th>
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
