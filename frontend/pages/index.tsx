import {
  Title,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Stack,
  Group,
  Button,
} from '@mantine/core';
import Link from 'next/link';

const featureCards = [
  {
    title: 'Dashboard',
    description:
      'Get a full overview of your SSD inventory with real-time stats, health scores, and performance metrics at a glance.',
    badge: 'Analytics',
    href: '/',
  },
  {
    title: 'View Records',
    description:
      'Browse, search, and filter all registered SSDs. Track serial numbers, capacity, status, and purchase history.',
    badge: 'Records',
    href: '/inventory',
  },
  {
    title: 'Add SSD',
    description:
      'Quickly register a new SSD into the system. Enter device details, assign to a unit, and generate an entry ID instantly.',
    badge: 'Register',
    href: '/inventory/add',
  },
];

export default function Home() {
  return (
    <Stack gap="xl" maw={900} mx="auto">
      {/* Hero Section */}
      <Card
        radius="xl"
        p="xl"
        style={{
          background: '#121212',
          color: 'white',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Stack gap="sm" style={{ maxWidth: 520 }}>
            <Badge variant="white" color="dark" size="sm" w="fit-content">
              Welcome Back
            </Badge>
            <Title order={1} style={{ color: 'white', lineHeight: 1.2 }}>
              SSD Inventory
              <br />
              Management System
            </Title>
            <Text size="md" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Track, manage, and monitor all your Solid State Drives from a single, unified platform.
            </Text>
            <Group mt="sm">
              <Button
                component={Link}
                href="/"
                variant="white"
                color="dark"
                radius="xl"
              >
                Go to Dashboard
              </Button>
              <Button
                component={Link}
                href="/inventory/add"
                variant="outline"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                radius="xl"
              >
                Add New SSD
              </Button>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* Feature Cards */}
      <div>
        <Title order={3} mb="md">
          What would you like to do?
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {featureCards.map((card) => (
            <Card
              key={card.title}
              component={Link}
              href={card.href}
              shadow="sm"
              radius="xl"
              p="xl"
              withBorder
              style={{
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                textDecoration: 'none',
                color: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <Stack gap="sm">
                <Group justify="space-between">
                  <Badge size="xs" color="dark" variant="light">
                    {card.badge}
                  </Badge>
                </Group>
                <Title order={4}>{card.title}</Title>
                <Text size="sm" c="dimmed">
                  {card.description}
                </Text>
                <Group gap={4} mt="xs" style={{ color: 'var(--mantine-color-dark-filled)' }}>
                  <Text size="sm" fw={500}>
                    Open
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
