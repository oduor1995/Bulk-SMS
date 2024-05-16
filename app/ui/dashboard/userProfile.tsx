'use client';
import { environment } from '@/environment/environment';
import { useState, useEffect } from 'react';

export function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Fetch user details when the component mounts
    fetchUserDetails();
  }, []);
  const dev_url = environment.dev_url;
  const local_user = environment.local_user;

  const fetchUserDetails = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      const response = await fetch(`${local_user}/api/v1/client-users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      const {
        data: { content },
      } = userData;
      setUserDetails(content[0].firstName);
      console.log(userData);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  return (
    <div>
      {userDetails ? (
        <div>
          <p>Welcome {userDetails}</p>
        </div>
      ) : (
        <p>User...</p>
      )}
    </div>
  );
}

// export default UserProfile;
