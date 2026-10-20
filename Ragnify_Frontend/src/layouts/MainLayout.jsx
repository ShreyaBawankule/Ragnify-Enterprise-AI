import React from 'react';
import { AppShell } from '../components/common/AppShell';

export function MainLayout({ title, children }) {
  return <AppShell title={title}>{children}</AppShell>;
}

export default MainLayout;
