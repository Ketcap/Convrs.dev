import { signal } from '@preact/signals-react';
import { Config } from '@prisma/client';

export const user = signal<{
  id: string;
  name: string;
  email: string;
  Configs: Config[]
} | null>(null)