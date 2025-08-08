import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useDrawerItems = (menuItems = []) => {
  const { userData } = useSelector((state) => state.auth);
  const [filteredDrawerItems, setFilteredDrawerItems] = useState([]);

  useEffect(() => {
    if (!userData) {
      setFilteredDrawerItems([]);
      return;
    }

    const permissionMap = {
      is_admin: userData.is_admin === 1,
      is_receiving: userData.is_receiving === 1,
      is_inspection: userData.is_inspection === 1,
      is_binning: userData.is_binning === 1,
      is_issue: userData.is_issue === 1,
      is_consumption: userData.is_consumption === 1,
    };

    const items = menuItems.filter((item) => {
      // Add comprehensive safety checks
      if (!item) return false;
      if (!item.accessControl) {
        console.warn('Menu item missing accessControl:', item);
        return false;
      }

      return item.accessControl.some((permission) => {
        // Ensure permission exists in the map
        if (!permissionMap.hasOwnProperty(permission)) {
          console.warn(`Unknown permission: ${permission}`);
          return false;
        }
        return permissionMap[permission];
      });
    });

    setFilteredDrawerItems(items);
  }, [userData, menuItems]);

  return filteredDrawerItems;
};

export default useDrawerItems;
