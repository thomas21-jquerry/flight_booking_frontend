export interface UserProfile {
  full_name: string;
  age: number;
  gender: string;
  profile_photo_url: string;
}

export const getUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await fetch('http://localhost:3001/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, profile: UserProfile): Promise<UserProfile> => {
  try {
    const response = await fetch('http://localhost:3001/users/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 