// assets
import {
  IconBuildingFactory2,
  IconListCheck,
  IconNotes,
  IconHistory,
  IconTools,
  IconPlayerPlay,
  IconBulb,
  IconCarTurbine,
  IconMapPin,
  IconBuildingWarehouse,
  IconCloudDown,
  IconTruckDelivery,
  IconForklift,
  IconHomeRibbon,
  IconHomeCheck,
} from '@tabler/icons-react';

// constant
const icons = {
  // IconBuildingFactory2,
  IconListCheck,
  IconNotes,
  IconHistory,
  IconTools,
  IconPlayerPlay,
  IconBulb,
  IconCarTurbine,
  IconBuildingWarehouse,
  IconCloudDown,
  IconTruckDelivery,
  IconForklift,
  IconHomeRibbon,
  IconHomeCheck,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  type: 'group',
  children: [
    {
      id: 'receiving-area',
      title: 'Receiving Area',
      type: 'item',
      url: '/receiving-area',
      icon: icons.IconTruckDelivery,
      breadcrumbs: false,
    },
    {
      id: 'binning-area',
      title: 'Binning Area',
      type: 'item',
      url: '/binning-area',
      icon: icons.IconBuildingWarehouse,
      breadcrumbs: false,
    },
    {
      id: 'finish-goods',
      title: 'Finish Good',
      type: 'item',
      url: '/finish-goods',
      icon: icons.IconBuildingWarehouse,
      breadcrumbs: false,
    },
    // {
    //   id: 'issue-area',
    //   title: 'Issue Area',
    //   type: 'item',
    //   url: '/issue-area',
    //   icon: icons.IconForklift,
    //   breadcrumbs: false,
    // },
    // {
    //   id: 'consumption-area',
    //   title: 'Consumption Area',
    //   type: 'item',
    //   url: '/consumption-area',
    //   icon: icons.IconHomeCheck,
    //   breadcrumbs: false,
    // },
    // {
    //   id: 'inventory-area',
    //   title: 'Inventory',
    //   type: 'item',
    //   url: '/inventory-area',
    //   icon: icons.IconHomeRibbon,
    //   breadcrumbs: false,
    // },
  ],
};

export default pages;
