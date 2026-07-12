import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Title,
  Stack,
  Avatar,
  useMantineColorScheme,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    label: 'Dashboard',
    description: 'System overview & statistics',
    href: '/',
  },
  {
    label: 'View Records',
    description: 'Browse SSD inventory',
    href: '/inventory',
  },
  {
    label: 'Add SSD',
    description: 'Register a new drive',
    href: '/inventory/add',
  },
];

export default function Layout({ children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={4} style={{ letterSpacing: '-0.5px' }}>
              SIMS
              <Text span c="dimmed" fw={400} size="sm" ml={6}>
                SSD Inventory Management System
              </Text>
            </Title>
          </Group>

          <Group gap="sm">
            <Button variant="subtle" color="dark" size="xs" onClick={() => toggleColorScheme()}>
              {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Avatar size="sm" radius="xl" color="dark">
              A
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="md">
        <Stack gap={4}>
          <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={4} px={4}>
            Navigation
          </Text>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <NavLink
                key={item.label}
                component={Link}
                href={item.href}
                active={isActive}
                label={item.label}
                description={item.description}
                variant="subtle"
                color="dark"
                style={{
                  borderRadius: '0 8px 8px 0',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  paddingLeft: isActive ? '16px' : '12px',
                  borderLeft: isActive
                    ? '4px solid var(--mantine-color-black)'
                    : '4px solid transparent',
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            );
          })}
        </Stack>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
