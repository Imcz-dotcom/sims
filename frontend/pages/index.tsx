import {
  Alert,
  Badge,
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import AdditionsTrendChart from '@/components/dashboard/AdditionsTrendChart';
import CapacityChart from '@/components/dashboard/CapacityChart';
import InterfaceChart from '@/components/dashboard/InterfaceChart';
import LocationChart from '@/components/dashboard/LocationChart';
import ModelPopularityChart from '@/components/dashboard/ModelPopularityChart';
import NeedsAttentionTable from '@/components/dashboard/NeedsAttentionTable';
import RecentAdditionsTable from '@/components/dashboard/RecentAdditionsTable';
import StatusOverviewChart from '@/components/dashboard/StatusOverviewChart';
import SummaryCards from '@/components/dashboard/SummaryCards';
import { chartColors, countBy, statusMeta, type SSD } from '@/components/dashboard/types';

export default function Home() {
  const [inventory, setInventory] = useState<SSD[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [capacityFilter, setCapacityFilter] = useState<string[]>([]);
  const [filterModal, setFilterModal] = useState<'status' | 'capacity' | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get<SSD[]>('http://localhost:5000/api/inventory');
        setInventory(response.data);
      } catch (requestError) {
        setError(
          axios.isAxiosError<{ error?: string }>(requestError)
            ? requestError.response?.data?.error || 'Failed to load dashboard data'
            : 'Failed to load dashboard data',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const capacityOptions = useMemo(
    () => Array.from(new Set(inventory.map((item) => item.capacity))).sort((a, b) => a.localeCompare(b)),
    [inventory],
  );

  const filteredInventory = useMemo(
    () =>
      inventory.filter(
        (item) =>
          (statusFilter.length === 0 || statusFilter.includes(item.status)) &&
          (capacityFilter.length === 0 || capacityFilter.includes(item.capacity)),
      ),
    [inventory, statusFilter, capacityFilter],
  );

  const dashboard = useMemo(() => {
    const inventory = filteredInventory;
    const statusCounts = {
      Active: inventory.filter((item) => item.status === 'Active').length,
      Available: inventory.filter((item) => item.status === 'Available').length,
      Failed: inventory.filter((item) => item.status === 'Failed').length,
    };
    const statusData = (Object.keys(statusCounts) as Array<keyof typeof statusCounts>).map((status) => ({
      name: status,
      value: statusCounts[status],
      color: statusMeta[status].color,
    }));
    const additions = inventory.reduce<Record<string, number>>((result, item) => {
      const date = item.createdAt ? item.createdAt.slice(0, 10) : 'Unknown';
      result[date] = (result[date] || 0) + 1;
      return result;
    }, {});
    const additionsData = Object.entries(additions)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([date, count]) => ({
        date: date === 'Unknown' ? date : new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count,
      }));

    return {
      statusCounts,
      statusData,
      locationData: countBy(inventory, 'location'),
      capacityData: countBy(inventory, 'capacity'),
      interfaceData: countBy(inventory, 'interface').map((item, index) => ({
        ...item,
        value: item.count,
        color: chartColors[index % chartColors.length],
      })),
      modelData: countBy(inventory, 'model').slice(0, 8),
      additionsData,
      recent: [...inventory]
        .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
        .slice(0, 6),
      failed: inventory.filter((item) => item.status === 'Failed'),
    };
  }, [filteredInventory]);

  if (loading) {
    return <Center h={400}><Loader size="lg" /></Center>;
  }

  if (error) {
    return <Alert color="red" title="Dashboard unavailable">{error}</Alert>;
  }

  return (
    <Stack gap="xl" maw={1400} mx="auto">
      {/* Hero Section */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Badge variant="light" color="dark" mb="xs">Live inventory analytics</Badge>
          <Title order={1}>SSD Dashboard</Title>
          <Text c="dimmed">Monitor inventory distribution, activity, and drives requiring attention.</Text>
        </div>
        <Button component={Link} href="/inventory/add" radius="xl">
          Register SSD
        </Button>
      </Group>

      {/* Filter Bar */}
      <Group gap="sm">
        <Text size="sm" fw={600} c="dimmed">Filters:</Text>
        <Button
          size="xs"
          radius="xl"
          variant={statusFilter.length > 0 ? 'filled' : 'light'}
          color="dark"
          leftSection={<IconFilter size={14} />}
          onClick={() => setFilterModal('status')}
        >
          Status{statusFilter.length > 0 ? ` (${statusFilter.length})` : ''}
        </Button>
        <Button
          size="xs"
          radius="xl"
          variant={capacityFilter.length > 0 ? 'filled' : 'light'}
          color="dark"
          leftSection={<IconFilter size={14} />}
          onClick={() => setFilterModal('capacity')}
        >
          Capacity{capacityFilter.length > 0 ? ` (${capacityFilter.length})` : ''}
        </Button>
      </Group>

      {/* Summary Cards */}
      <SummaryCards
        total={filteredInventory.length}
        active={dashboard.statusCounts.Active}
        available={dashboard.statusCounts.Available}
        failed={dashboard.statusCounts.Failed}
      />

      {inventory.length === 0 ? (
        <Alert color="blue" title="No inventory data yet">
          Register your first SSD to populate the dashboard charts.
        </Alert>
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <StatusOverviewChart data={dashboard.statusData} />
            <LocationChart data={dashboard.locationData} />
            <CapacityChart data={dashboard.capacityData} />
            <InterfaceChart data={dashboard.interfaceData} />
            <AdditionsTrendChart data={dashboard.additionsData} />
            <ModelPopularityChart data={dashboard.modelData} />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, lg: 2 }}>
            <RecentAdditionsTable data={dashboard.recent} />
            <NeedsAttentionTable data={dashboard.failed} />
          </SimpleGrid>
        </>
      )}

      <Modal
        opened={filterModal === 'status'}
        onClose={() => setFilterModal(null)}
        title="Filter by Status"
        radius="lg"
      >
        <Checkbox.Group value={statusFilter} onChange={setStatusFilter}>
          <Stack gap="sm">
            {(['Active', 'Available', 'Failed'] as const).map((status) => (
              <Checkbox key={status} value={status} label={status} />
            ))}
          </Stack>
        </Checkbox.Group>
        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" color="dark" onClick={() => setStatusFilter([])}>
            Clear
          </Button>
          <Button color="dark" onClick={() => setFilterModal(null)}>
            Apply
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={filterModal === 'capacity'}
        onClose={() => setFilterModal(null)}
        title="Filter by Capacity"
        radius="lg"
      >
        <Checkbox.Group value={capacityFilter} onChange={setCapacityFilter}>
          <Stack gap="sm">
            {capacityOptions.map((capacity) => (
              <Checkbox key={capacity} value={capacity} label={capacity} />
            ))}
          </Stack>
        </Checkbox.Group>
        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" color="dark" onClick={() => setCapacityFilter([])}>
            Clear
          </Button>
          <Button color="dark" onClick={() => setFilterModal(null)}>
            Apply
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
