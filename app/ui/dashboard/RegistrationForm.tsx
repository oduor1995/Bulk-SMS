'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Aesutils from '@/app/lib/encryption';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import MultipleSelectCheckmarks from './multiselect';
import { environment } from '@/environment/environment';

const aesutils = new Aesutils();

interface FormData {
  Department: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  senderIds: string[];
  roleCode: string;
  phoneNumber: string;
}
interface RegistrationFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    Department: 'KE',
    firstName: '',
    lastName: '',
    emailAddress: '',

    senderIds: [],
    roleCode: '',
    phoneNumber: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [senders, setSenders] = useState([]);
  const [id, setId] = useState([]);
  const Branches = [
    { code: '001', name: 'head Office' },
    { code: '002', name: 'Finserve' },
    { code: '003', name: 'Moi Avenue' },
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormData,
  ) => {
    const newFormData = { ...formData };
    if (field === 'senderIds') {
      // Find the index of the selected sender ID in the senderId array
      const selectedIndex = senderId.indexOf(e.target.value);
      if (selectedIndex !== -1) {
        // Find the corresponding id in the id array using the index
        const selectedId = id[selectedIndex];
        // Assign the corresponding id as an array to the senderIds field
        newFormData[field] = [selectedId.toString()]; // Ensure it is stored as a string array
      } else {
        // In case no valid selection was made or it couldn't find the id
        newFormData[field] = [];
      }
    } else {
      newFormData[field] = e.target.value;
    }
    setFormData(newFormData);
  };
  const dev_url = environment.dev_url;

  useEffect(() => {
    // const fetchSenderId = async () => {
    //   const token = localStorage.getItem('accessToken'); // Retrieve the token
    //   if (!token) {
    //     console.error('No access token available.');
    //     return;
    //   }
    //   const accessToken = localStorage.getItem('accessToken');
    //   try {
    //     const response = await fetch(`${dev_url}/api/v1/client-senderIDs`, {
    //       method: 'GET',
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch data');
    //     }
    //     const Data = await response.json();
    //     setSenders(Data.data.content.map((item: any) => item));
    //     setId(Data.data.content.map((item: any) => item.id));
    //   } catch (error) {
    //     console.error('Failed to fetch senderId:', error);
    //   }
    // };
    // fetchSenderId();
  }, []);
  // useEffect(() => {
  //   console.log('This are the sender Ids', senderId);
  //   console.log('check id', id);
  // }, [senderId, id]);

  const handleSubmit = async (e: FormEvent) => {
    console.log('i am clicked');
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    onSubmit(formData);

    try {
      // Call your API here with form data
      await onSubmit(formData);
      setSuccessMessage('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An error occurred while submitting the form');
    }
  };
  const handleSenderIdsChange = (newSenderIds: string[]) => {
    setFormData({ ...formData, senderIds: newSenderIds });
  };

  return (
    <div className="container mx-auto max-w-lg p-4">
      <h2 className="mb-4 text-lg font-semibold">Add New User</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {successMessage && (
          <div className="text-green-500">{successMessage}</div>
        )}
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange(e, 'firstName')}
            placeholder="First Name"
            className="rounded border border-gray-300 p-2"
            required
          />
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange(e, 'lastName')}
            placeholder="Last Name"
            className="rounded border border-gray-300 p-2"
            required
          />
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange(e, 'phoneNumber')}
            placeholder="Phone Number"
            className="rounded border border-gray-300 p-2"
            required
          />
          <input
            type="email"
            value={formData.emailAddress}
            onChange={(e) => handleInputChange(e, 'emailAddress')}
            placeholder="Email"
            className="rounded border border-gray-300 p-2"
            required
          />
          <MultipleSelectCheckmarks
            // senderIds={formData.senderIds}
            onSenderIdsChange={handleSenderIdsChange}
            // options={senders} // Assuming 'senderId' is the array of options
          />

          <select
            value={formData.roleCode}
            onChange={(e) => handleInputChange(e, 'roleCode')}
            className="rounded border border-gray-300 p-2"
          >
            <option value="">Select User Group</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 rounded bg-red-500 p-2 text-white"
        >
          Enroll
        </button>
      </form>
    </div>
  );
};

// export default RegistrationForm;
