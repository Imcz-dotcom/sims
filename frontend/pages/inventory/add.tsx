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

export default function AddSSD() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save the data to a database here
    alert('SSD successfully registered!');
    router.push('/inventory');
  };

  return (
    <Stack gap="lg" maw={600} mx="auto" mt="xl">
      <div>
        <Title order={2} style={{ letterSpacing: '-0.5px' }}>
          Register New SSD
        </Title>
        <Text size="sm" c="dimmed">
          Add a new solid-state drive to the system inventory.
        </Text>
      </div>

      <Paper shadow="sm" radius="xl" p="xl" withBorder component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Model Name"
            placeholder="e.g. Samsung 990 Pro"
            required
            radius="md"
          />

          <TextInput
            label="Serial Number"
            placeholder="e.g. S71DNU0W123456K"
            required
            radius="md"
            styles={{ input: { fontFamily: 'monospace' } }}
          />

          <Group grow>
            <Select
              label="Capacity"
              placeholder="Select capacity"
              data={['250 GB', '500 GB', '1 TB', '2 TB', '4 TB', '8 TB']}
              required
              radius="md"
            />

            <TextInput
              label="Health Status (%)"
              placeholder="e.g. 100"
              defaultValue="100"
              required
              radius="md"
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
            >
              Save SSD
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
