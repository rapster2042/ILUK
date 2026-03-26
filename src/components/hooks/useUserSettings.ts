import { useState, useEffect, useCallback } from 'react';
import { getUserId, getUserProfile, createUserProfile, updateUserProfile } from '@/db/api';
import type { UserProfile } from '@/types';

export const useUserSettings = () => {
  const [userId, setUserId] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const id = getUserId();
      setUserId(id);

      let userProfile = await getUserProfile(id);
      if (!userProfile) {
        userProfile = await createUserProfile(id);
      }
      setProfile(userProfile);
      setLoading(false);

      if (userProfile) {
        applyAccessibilitySettings(userProfile);
      }
    };

    initUser();
  }, []);

  const applyAccessibilitySettings = (profile: UserProfile) => {
    const body = document.body;

    body.className = body.className.replace(/text-size-\w+/, '');
    body.classList.add(`text-size-${profile.text_size}`);

    body.className = body.className.replace(/contrast-\w+/, '');
    if (profile.contrast_mode !== 'normal') {
      body.classList.add(`contrast-${profile.contrast_mode}`);
    }

    if (profile.reduced_motion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  };

  const updateSettings = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    const updated = await updateUserProfile(userId, updates);
    if (updated) {
      setProfile(updated);
      applyAccessibilitySettings(updated);
    }
  }, [userId]);

  return {
    userId,
    profile,
    loading,
    updateSettings
  };
};
