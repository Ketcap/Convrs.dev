import { signal } from '@preact/signals-react';
import { Config } from '@prisma/client';
import nookies from 'nookies';

export const user = signal<{
  id: string;
  name: string;
  email: string;
  Configs: Config[]
} | null>(null)

export const token = signal(nookies.get(null, 'token')?.token || undefined);
export const refreshToken = signal(nookies.get(null, 'refreshToken')?.refreshToken || undefined);