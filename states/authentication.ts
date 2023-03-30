import { signal } from '@preact/signals-react';
import { Config, User } from '@prisma/client';
import nookies from 'nookies';

export const user = signal<User & { Configs: Config[] } | null>(null)

// @ts-ignore , editor does not throw error but it does not work
export const token = signal(nookies.get(null, 'token')?.token || undefined);
export const refreshToken = signal(nookies.get(null, 'refreshToken')?.refreshToken || undefined);