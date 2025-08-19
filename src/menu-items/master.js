// assets
import { IconBuilding, IconUsers, IconUserPentagon, IconMapPin,IconStatusChange } from '@tabler/icons-react';

// constant
const icons = {
  IconBuilding,
  IconUsers,
  IconUserPentagon,
  IconMapPin,
  IconStatusChange
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const master = {
  id: 'master',
  title: 'Master',
  caption: 'Orders, Services',
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
    {
      id: 'servicelist',
      title: 'Service List',
      type: 'collapse',
      icon: icons.IconBuilding,
   
      children: [
        {
          id: 'services',
          title: 'Services',
          type: 'item',
          url: '/services',
          breadcrumbs: false,
        },
      ],
    },
    {
      id: 'statuslist',
      title: 'Statuses List',
      type: 'item',
      icon: icons.IconStatusChange,
      url: '/status',
      breadcrumbs: false, 
    }
  ],
};

export default master;
