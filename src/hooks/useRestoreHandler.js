import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showDialog } from 'src/redux/slices/components/confirmDialog';

const useRestoreHandler = () => {
  const dispatch = useDispatch();

  const handleRestore = useCallback(
    async ({ restoreAction, moduleName = 'item', data }) => {
      if (!restoreAction) {
        throw new Error('restoreAction is required');
      }

      try {
        const confirmed = await new Promise((resolve) => {
          dispatch(
            showDialog({
              title: 'Confirm Restore',
              message: `Are you sure you want to restore this ${moduleName}?`,
              onConfirm: () => resolve(true),
              onCancel: () => resolve(false),
            }),
          );
        });

        if (confirmed) {
          await restoreAction(data?.id);
          return true;
        }
        return false;
      } catch (error) {
        console.error(`${moduleName} restore operation error:`, error);
        throw error;
      }
    },
    [dispatch],
  );

  return handleRestore;
};

export default useRestoreHandler;
