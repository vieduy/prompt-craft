import { useEffect, useRef } from 'react';
import { useUser } from '@stackframe/react';

// Global cache for user data to prevent multiple /me calls
let userCache: any = null;
let userCacheTimestamp = 0;
const USER_CACHE_DURATION = 5000; // 5 seconds cache

export const useAuthOptimization = () => {
  const user = useUser();
  const lastUserRef = useRef<any>(null);

  useEffect(() => {
    // Only update cache if user actually changed
    if (user !== lastUserRef.current) {
      userCache = user;
      userCacheTimestamp = Date.now();
      lastUserRef.current = user;
    }
  }, [user]);

  return user;
};

// Optimized auth functions
export const getCachedUser = () => {
  const now = Date.now();
  if (userCache && (now - userCacheTimestamp) < USER_CACHE_DURATION) {
    return userCache;
  }
  return null;
};

export const clearUserCache = () => {
  userCache = null;
  userCacheTimestamp = 0;
}; 