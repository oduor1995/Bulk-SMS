import { environment } from '@/environment/environment';
import { useState, useEffect } from 'react';

export function GroupProfile() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
  }, []);
  const dev_core_url = environment.dev_core_url;

  const fetchGroupDetails = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      const response = await fetch(
        `${dev_core_url}/api/v1/get/sms-campaign-group`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }

      const groupData = await response.json();
      setGroups(groupData.data.content);
    } catch (error) {
      console.error('Failed to fetch group details:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Group Details:</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <p>Group ID: {group.id}</p>
            <p>Group Name: {group.name}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}
