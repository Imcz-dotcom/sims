export interface SSD {
  _id: string;
  deviceId: string;
  model: string;
  serialNumber: string;
  capacity: string;
  interface: string;
  status: 'Active' | 'Available' | 'Failed';
  location: string;
  createdAt: string;
}

export const statusMeta = {
  Active: { color: 'green.6', badge: 'green' },
  Available: { color: 'blue.6', badge: 'blue' },
  Failed: { color: 'red.6', badge: 'red' },
};
