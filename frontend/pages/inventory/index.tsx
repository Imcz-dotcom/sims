import {
  Title,
  Text,
  Table,
  Badge,
  Paper,
  Group,
  Button,
  TextInput,
  Select,
  Stack,
  Loader,
  Center,
  ActionIcon,
  Popover,
  Checkbox,
  Modal,
} from '@mantine/core';
import { IconFilter, IconPencil, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  CAPACITY_OPTIONS,
  INTERFACE_OPTIONS,
  LOCATION_OPTIONS,
  MODEL_OPTIONS,
  STATUS_OPTIONS,
} from '@/lib/options';
import { statusMeta, type SSD } from '@/lib/shared';

export default function Inventory() {
  const [inventory, setInventory] = useState<SSD[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<SSD | null>(null);
  const [editForm, setEditForm] = useState({
    deviceId: '',
    model: '',
    serialNumber: '',
    capacity: '',
    interface: '',
    status: '',
    location: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_URL!);
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

  const openEdit = (item: SSD) => {
    setEditTarget(item);
    setEditForm({
      deviceId: item.deviceId,
      model: item.model,
      serialNumber: item.serialNumber,
      capacity: item.capacity,
      interface: item.interface,
      status: item.status,
      location: item.location,
    });
    setEditError('');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditLoading(true);
    setEditError('');
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL!}/${editTarget._id}`, editForm);
      setInventory((prev) =>
        prev.map((item) => (item._id === editTarget._id ? res.data.data : item)),
      );
      setEditTarget(null);
    } catch (err) {
      setEditError(
        axios.isAxiosError<{ error?: string }>(err)
          ? err.response?.data?.error || 'Failed to update SSD'
          : 'Failed to update SSD',
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this SSD record? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL!}/${id}`);
      setInventory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(
        axios.isAxiosError<{ error?: string }>(err)
          ? err.response?.data?.error || 'Failed to delete SSD'
          : 'Failed to delete SSD',
      );
    } finally {
      setDeletingId(null);
    }
  };

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

  const rows = filtered.map((item) => (
    <Table.Tr key={item._id}>
      <Table.Td style={{ fontWeight: 600 }}>{item.deviceId}</Table.Td>
      <Table.Td>{item.model}</Table.Td>
      <Table.Td style={{ fontFamily: 'monospace' }}>{item.serialNumber}</Table.Td>
      <Table.Td>{item.capacity}</Table.Td>
      <Table.Td>{item.interface}</Table.Td>
      <Table.Td>{item.location}</Table.Td>
      <Table.Td>
        <Badge color={statusMeta[item.status]?.badge ?? 'dark'} variant="light" size="sm">
          {item.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
            <ActionIcon
              variant="subtle"
              color="dark"
              aria-label="Edit SSD"
              onClick={() => openEdit(item)}
            >
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label="Delete SSD"
              loading={deletingId === item._id}
              onClick={() => handleDelete(item._id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

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
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>

      <Modal
        opened={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title="Edit SSD"
        radius="lg"
        size="md"
      >
        <Stack gap="md" component="form" onSubmit={handleEditSubmit}>
          {editError && (
            <Text c="red" size="sm">
              {editError}
            </Text>
          )}

          <TextInput
            label="Device ID"
            required
            radius="md"
            value={editForm.deviceId}
            onChange={(e) => setEditForm({ ...editForm, deviceId: e.target.value })}
          />

          <Select
            label="Model"
            placeholder="Select model"
            data={MODEL_OPTIONS}
            required
            searchable
            radius="md"
            value={editForm.model}
            onChange={(val) => setEditForm({ ...editForm, model: val || '' })}
          />

          <TextInput
            label="Serial Number"
            required
            radius="md"
            styles={{ input: { fontFamily: 'monospace' } }}
            value={editForm.serialNumber}
            onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
          />

          <Group grow>
            <Select
              label="Capacity"
              placeholder="Select capacity"
              data={CAPACITY_OPTIONS}
              required
              radius="md"
              value={editForm.capacity}
              onChange={(val) => setEditForm({ ...editForm, capacity: val || '' })}
            />
            <Select
              label="Interface"
              placeholder="Select interface"
              data={INTERFACE_OPTIONS}
              required
              radius="md"
              value={editForm.interface}
              onChange={(val) => setEditForm({ ...editForm, interface: val || '' })}
            />
          </Group>

          <Group grow>
            <Select
              label="Status"
              placeholder="Select status"
              data={STATUS_OPTIONS}
              required
              radius="md"
              value={editForm.status}
              onChange={(val) => setEditForm({ ...editForm, status: val || '' })}
            />
            <Select
              label="Location"
              placeholder="Select location"
              data={LOCATION_OPTIONS}
              required
              searchable
              radius="md"
              value={editForm.location}
              onChange={(val) => setEditForm({ ...editForm, location: val || '' })}
            />
          </Group>

          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" color="dark" radius="xl" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="filled" color="dark" radius="xl" loading={editLoading}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
