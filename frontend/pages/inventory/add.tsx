import {
  Title,
  Text,
  Paper,
  Group,
  Button,
  TextInput,
  Select,
  Stack,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';

export default function RegisterSSD() {
  const router = useRouter();
  const [form, setForm] = useState({
    deviceId: '',
    model: '',
    serialNumber: '',
    capacity: '',
    interface: '',
    status: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/inventory', form);
      router.push('/inventory');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register SSD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg" maw={600} mx="auto" mt="xl">
      <div>
        <Title order={2} style={{ letterSpacing: '-0.5px' }}>
          Register New SSD
        </Title>
        <Text size="sm" c="dimmed">
          Add a new solid-state drive to the system inventory database.
        </Text>
      </div>

      <Paper shadow="sm" radius="xl" p="xl" withBorder component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          {error && <Text c="red" size="sm">{error}</Text>}

          <Group grow>
            <TextInput
              label="Device ID"
              placeholder="e.g. SSD-006"
              required
              radius="md"
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
            />
            <TextInput
              label="Model"
              placeholder="e.g. Samsung 990 Pro"
              required
              radius="md"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
          </Group>

          <TextInput
            label="Serial Number"
            placeholder="e.g. S71DNU0W123456K"
            required
            radius="md"
            styles={{ input: { fontFamily: 'monospace' } }}
            value={form.serialNumber}
            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
          />

          <Group grow>
            <Select
              label="Capacity"
              placeholder="Select capacity"
              data={['250 GB', '500 GB', '1 TB', '2 TB', '4 TB', '8 TB']}
              required
              radius="md"
              value={form.capacity}
              onChange={(val) => setForm({ ...form, capacity: val || '' })}
            />
            <Select
              label="Interface"
              placeholder="Select interface"
              data={['SATA III', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0', 'NVMe PCIe 5.0']}
              required
              radius="md"
              value={form.interface}
              onChange={(val) => setForm({ ...form, interface: val || '' })}
            />
          </Group>

          <Group grow>
            <Select
              label="Status"
              placeholder="Select status"
              data={['Active', 'Available', 'Failed']}
              required
              radius="md"
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val || '' })}
            />
            <TextInput
              label="Location"
              placeholder="e.g. Rack A, Bay 5"
              required
              radius="md"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Group>

          <Group justify="flex-end" mt="lg">
            <Button
              component={Link}
              href="/inventory"
              variant="subtle"
              color="dark"
              radius="xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              color="dark"
              radius="xl"
              loading={loading}
            >
              Save SSD
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
