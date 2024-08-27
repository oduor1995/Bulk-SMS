'use client';

import { useState, useEffect } from 'react';
import { environment } from '@/environment/environment';

interface FormData {
  campaignName: string;
  campaignGroupId: number;
  senderId: number;
  message: string;
  campaignDate: string;
}

interface Sender {
  id: number;
  senderID: string;
}

interface CampaignGroup {
  id: number;
  name: string;
}
interface CampaignFormProps {
  onSubmitSuccess: () => void;
}

export const CampaignForm = ({ onSubmitSuccess }: CampaignFormProps) => {
  const [senderNames, setSenderNames] = useState<Sender[]>([]);
  const [campaignGroups, setCampaignGroups] = useState<CampaignGroup[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [senderId, setSenderId] = useState('');

  useEffect(() => {
    const fetchSenderId = async () => {
      const token = localStorage.getItem('accessToken'); // Retrieve the token
      if (!token) {
        console.error('No access token available.');
        return;
      }
      const local_user = environment.local_user;
      try {
        const response = await fetch(`${local_user}/api/v1/client-senderIDs`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSenderNames(data.data.content);
      } catch (error) {
        console.error('Failed to fetch senderId:', error);
      }
    };

    const fetchCampaignGroups = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token available.');
        return;
      }
      const local_core = environment.local_core;
      try {
        const response = await fetch(
          `${local_core}/api/v1/get/sms-campaign-group`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch campaign groups');
        }
        const data = await response.json();
        setCampaignGroups(data.data.content);
      } catch (error) {
        console.error('Failed to fetch campaign groups:', error);
      }
    };

    fetchSenderId();
    fetchCampaignGroups();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    campaignName: '',
    campaignGroupId: campaignGroups.length > 0 ? campaignGroups[0].id : 1,
    senderId: senderNames.length > 0 ? senderNames[0].id : 1,
    message: '',
    campaignDate: '2024-04-20',
  });

  useEffect(() => {
    if (campaignGroups.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        campaignGroupId: campaignGroups[0].id,
      }));
    }
    if (senderNames.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        senderId: senderNames[0].id,
      }));
    }
  }, [campaignGroups, senderNames]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = localStorage.getItem('accessToken');
    const local_core = environment.local_core;
    const newRow = {
      id: Date.now().toString(), // Generate a unique ID
      groupName: campaignName,
      message: message,
      senderId: senderId,
      totalCustomers: 0,
      createdDate: new Date().toLocaleDateString(),
    };
    onSubmitSuccess(newRow); // Pass the new row data to the parent component

    e.preventDefault();
    try {
      const response = await fetch(`${local_core}/api/v1/sms-campaign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      onSubmitSuccess(); // Call the callback function
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <h1 className="mb-0 text-center text-xl font-bold">Create Campaign</h1>

      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Campaign Name
              <input
                type="text"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Campaign Group
              <select
                name="campaignGroupId"
                value={formData.campaignGroupId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {campaignGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Sender ID
              <select
                name="senderId"
                value={formData.senderId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {senderNames.map((sender) => (
                  <option key={sender.id} value={sender.id}>
                    {sender.senderID}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
