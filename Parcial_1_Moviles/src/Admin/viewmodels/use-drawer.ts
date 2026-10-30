import { useState } from 'react';

import { AdminProfile, DrawerItemOption } from '../Models/drawer.model';

export function UseDrawer() {
  const [profile] = useState<AdminProfile>({
    name: 'Admin User',
    role: 'System management',
    avatarUrl: '',
    version: 'v4.4.4',
  });

  const navigationOptions: DrawerItemOption[] = [
    { name: 'dashboard', label: 'Dashboard', icon: 'grid' },
  ];

  return { profile, navigationOptions };
}
