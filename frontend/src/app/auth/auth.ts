import { stackClientApp } from "./stack";

// Cache for user data to prevent multiple /me calls
let userCache: any = null;
let userCacheTimestamp = 0;
const USER_CACHE_DURATION = 5000; // 5 seconds cache

const getCachedUser = async () => {
  const now = Date.now();
  if (userCache && (now - userCacheTimestamp) < USER_CACHE_DURATION) {
    return userCache;
  }
  
  // Fetch fresh user data
  const user = await stackClientApp.getUser();
  userCache = user;
  userCacheTimestamp = now;
  return user;
};

export const auth = {
  getAuthHeaderValue: async (): Promise<string> => {
    const user = await getCachedUser();

    if (!user) {
      return "";
    }

    const { accessToken } = await user.getAuthJson();
    return `Bearer ${accessToken}`;
  },
  getAuthToken: async (): Promise<string> => {
    const user = await getCachedUser();

    if (!user) {
      return "";
    }

    const { accessToken } = await user.getAuthJson();
    return accessToken ?? "";
  },
  getUserProfile: async (): Promise<{sub: string, name?: string, email?: string} | null> => {
    const user = await getCachedUser();

    if (!user) {
      return null;
    }

    return {
      sub: user.id,
      name: user.displayName || undefined,
      email: user.primaryEmail || undefined,
    };
  },
  updateBackendProfile: async (): Promise<boolean> => {
    const user = await getCachedUser();

    if (!user) {
      console.log('updateBackendProfile: No user found');
      return false;
    }

    const profileData = {
      name: user.displayName || null,
      email: user.primaryEmail || null,
    };

    console.log('updateBackendProfile: Sending profile data:', profileData);

    try {
      const response = await fetch('/routes/practice/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await auth.getAuthHeaderValue(),
        },
        body: JSON.stringify(profileData),
      });

      console.log('updateBackendProfile: Response status:', response.status, response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('updateBackendProfile: Error response:', errorText);
      }

      return response.ok;
    } catch (error) {
      console.error('Failed to update backend profile:', error);
      return false;
    }
  },
  // Function to clear cache when needed (e.g., on logout)
  clearUserCache: () => {
    userCache = null;
    userCacheTimestamp = 0;
  }
}
