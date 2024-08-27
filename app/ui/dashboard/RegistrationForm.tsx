'use client';
import { useState, useEffect } from 'react';
import { environment } from '@/environment/environment';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  roleCode: '';
  senderIds: number[];
}

interface Sender {
  id: number;
  senderID: string;
}

interface UserFormProps {
  onSubmit: (formData: FormData) => void;
}

export const UserForm = ({ onSubmit }: UserFormProps) => {
  const [senderNames, setSenderNames] = useState<Sender[]>([]);
  const [userGroups, setUserGroups] = useState<FormData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    roleCode: '', // Default to 'user'
    senderIds: [],
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchSenderId = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token available.');
        return;
      }
      const local_user = environment.local_user;
      const dev_url = environment.dev_url;
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

    const fetchUserGroups = async () => {
      const local_user = environment.local_user;
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token available.');
        return;
      }
      try {
        const response = await fetch(`${local_user}/api/v1/client-user/roles`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user groups');
        }
        const data = await response.json();
        setUserGroups(data.data.content);
      } catch (error) {
        console.error('Failed to fetch user groups:', error);
      }
    };

    fetchSenderId();
    fetchUserGroups();
  }, []);

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

  const handleSenderChange = (id: number) => {
    setFormData((prevFormData) => {
      const senderIds = prevFormData.senderIds.includes(id)
        ? prevFormData.senderIds.filter((senderId) => senderId !== id)
        : [...prevFormData.senderIds, id];
      return {
        ...prevFormData,
        senderIds,
      };
    });
  };
  const getSelectedSenderNames = () => {
    return formData.senderIds
      .map((id) => {
        const sender = senderNames.find((sender) => sender.id === id);
        return sender ? sender.senderID : '';
      })
      .join(', ');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data to the parent component's onSubmit function
  };

  return (
    <>
      <h1 className="mb-0 text-center text-xl font-bold">Create User</h1>

      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name
              <input
                type="text"
                name="firstName"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
              <input
                type="text"
                name="lastName"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Sender IDs
              <div
                className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onClick={() => setDropdownVisible(!dropdownVisible)}
              >
                {formData.senderIds.length === 0
                  ? 'Select Sender IDs'
                  : `Selected: ${formData.senderIds.length}`}
              </div>
              {dropdownVisible && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
                  <div className="max-h-60 overflow-y-auto p-2">
                    {senderNames.map((sender) => (
                      <div key={sender.id} className="flex items-center p-2">
                        <input
                          type="checkbox"
                          value={sender.id}
                          checked={formData.senderIds.includes(sender.id)}
                          onChange={() => handleSenderChange(sender.id)}
                          className="form-checkbox h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {sender.senderID}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              User Group
              <select
                name="roleCode"
                value={formData.roleCode}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {userGroups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
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
