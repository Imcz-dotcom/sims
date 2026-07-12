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
  Loader,
  Center,
  ActionIcon,
  Popover,
  Checkbox,
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface SSD {
  _id: string;
  deviceId: string;
  model: string;
  serialNumber: string;
  capacity: string;
  interface: string;
  status: string;
  location: string;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<SSD[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inventory');
        setInventory(res.data);
      } catch (err) {
        setError(
          axios.isAxiosError<{ error?: string }>(err)
            ? err.response?.data?.error || 'Failed to load inventory'
            : 'Failed to load inventory',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const capacityOptions = useMemo(
    () =>
      Array.from(new Set(inventory.map((item) => item.capacity))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [inventory],
  );
  const statusOptions = useMemo(
    () =>
      Array.from(new Set(inventory.map((item) => item.status))).sort((a, b) => a.localeCompare(b)),
    [inventory],
  );

  const filtered = inventory.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.deviceId.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)) &&
      (capacityFilter.length === 0 || capacityFilter.includes(item.capacity)) &&
      (statusFilter.length === 0 || statusFilter.includes(item.status))
    );
  });

  const rows = filtered.map((item) => {
    let statusColor = 'dark';
    if (item.status === 'Active') statusColor = 'dark';
    if (item.status === 'Available') statusColor = 'gray';
    if (item.status === 'Failed') statusColor = 'red';

    return (
      <Table.Tr key={item._id}>
        <Table.Td style={{ fontWeight: 600 }}>{item.deviceId}</Table.Td>
        <Table.Td>{item.model}</Table.Td>
        <Table.Td style={{ fontFamily: 'monospace' }}>{item.serialNumber}</Table.Td>
        <Table.Td>{item.capacity}</Table.Td>
        <Table.Td>{item.interface}</Table.Td>
        <Table.Td>{item.location}</Table.Td>
        <Table.Td>
          <Badge
            variant={
              item.status === 'Active'
                ? 'filled'
                : item.status === 'Available'
                  ? 'light'
                  : 'outline'
            }
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Group>

        {loading ? (
          <Center py="xl">
            <Loader color="dark" />
          </Center>
        ) : error ? (
          <Text c="red" size="sm">
            {error}
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Device ID</Table.Th>
                  <Table.Th>Model</Table.Th>
                  <Table.Th>Serial Number</Table.Th>
                  <Table.Th>
                    <Group gap={4} wrap="nowrap">
                      <Text size="sm" fw={600}>
                        Capacity
                      </Text>
                      <Popover width={180} position="bottom-start" withArrow shadow="md">
                        <Popover.Target>
                          <ActionIcon
                            size="sm"
                            variant={capacityFilter.length > 0 ? 'filled' : 'subtle'}
                            color="dark"
                            aria-label="Filter by capacity"
                          >
                            <IconFilter size={14} />
                          </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Checkbox.Group value={capacityFilter} onChange={setCapacityFilter}>
                            <Stack gap="xs">
                              {capacityOptions.map((capacity) => (
                                <Checkbox
                                  key={capacity}
                                  value={capacity}
                                  label={capacity}
                                  size="xs"
                                />
                              ))}
                            </Stack>
                          </Checkbox.Group>
                        </Popover.Dropdown>
                      </Popover>
                    </Group>
                  </Table.Th>
                  <Table.Th>Interface</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>
                    <Group gap={4} wrap="nowrap">
                      <Text size="sm" fw={600}>
                        Status
                      </Text>
                      <Popover width={160} position="bottom-start" withArrow shadow="md">
                        <Popover.Target>
                          <ActionIcon
                            size="sm"
                            variant={statusFilter.length > 0 ? 'filled' : 'subtle'}
                            color="dark"
                            aria-label="Filter by status"
                          >
                            <IconFilter size={14} />
                          </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Checkbox.Group value={statusFilter} onChange={setStatusFilter}>
                            <Stack gap="xs">
                              {statusOptions.map((status) => (
                                <Checkbox key={status} value={status} label={status} size="xs" />
                              ))}
                            </Stack>
                          </Checkbox.Group>
                        </Popover.Dropdown>
                      </Popover>
                    </Group>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>
    </Stack>
  );
}
