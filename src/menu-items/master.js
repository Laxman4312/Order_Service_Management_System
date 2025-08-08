// assets
import { IconBuilding, IconUsers, IconUserPentagon, IconMapPin } from '@tabler/icons-react';

// constant
const icons = {
  IconBuilding,
  IconUsers,
  IconUserPentagon,
  IconMapPin,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const master = {
  id: 'master',
  title: 'Master',
  caption: 'Users, Locations',
  // caption: 'Department, Users',
  type: 'group',
  children: [
    {
      id: 'orderlist',
      title: 'Order List',
      type: 'collapse',
      icon: icons.IconUserPentagon,

      children: [
        // {
        //   id: 'departments',
        //   title: 'Departments',
        //   type: 'item',
        //   url: '/user-master/departments',
        //   breadcrumbs: false,
        // },
        {
          id: 'orders',
          title: 'Orders',
          type: 'item',
          url: '/orders',
          breadcrumbs: false,
        },
      ],
    },
  ],
};

export default master;
