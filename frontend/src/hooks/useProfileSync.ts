import { useEffect, useRef } from 'react';
import { useUser } from '@stackframe/react';
import { auth } from 'app/auth';

// Global flag to track if profile sync is in progress
let isProfileSyncInProgress = false;
let lastProfileSyncTime = 0;
const PROFILE_SYNC_COOLDOWN = 30000; // 30 seconds cooldown

export const useProfileSync = () => {
  const user = useUser();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    const syncProfile = async () => {
      // Skip if no user, already synced, or sync is in progress
      if (!user || hasSyncedRef.current || isProfileSyncInProgress) {
        return;
      }

      // Check cooldown
      const now = Date.now();
      if (now - lastProfileSyncTime < PROFILE_SYNC_COOLDOWN) {
        return;
      }

      // Set sync in progress flag
      isProfileSyncInProgress = true;
      hasSyncedRef.current = true;

      try {
        await auth.updateBackendProfile();
        lastProfileSyncTime = now;
        console.log('Profile synced successfully');
      } catch (error) {
        console.error('Failed to sync profile:', error);
        // Reset sync flag on error so it can be retried
        hasSyncedRef.current = false;
      } finally {
        isProfileSyncInProgress = false;
      }
    };

    syncProfile();
  }, [user]);

  // Reset sync flag when user changes
  useEffect(() => {
    hasSyncedRef.current = false;
  }, [user?.id]);

  return null; // This hook doesn't return anything, it just handles side effects
}; 