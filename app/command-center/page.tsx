'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CommandCenterClient = dynamic(
  () => import('@/components/command-center/CommandCenterClient'),
  { ssr: false }
);

export default function CommandCenterPage() {
  return <CommandCenterClient />;
}
