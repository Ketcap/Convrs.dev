import { signal } from '@preact/signals-react';

export const user = signal<{
  id: string;
  email: string;
} | null>(null)