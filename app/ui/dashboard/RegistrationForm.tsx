'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Aesutils from '@/app/lib/encryption';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const aesutils = new Aesutils();

interface FormData {
  Branch: string;
  Department: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  senderIds: string[];
  roleCode: string;
}
interface RegistrationFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    Branch: '',
    Department: 'KE',
    firstName: '',
    lastName: '',
    emailAddress: '',
    senderIds: [],
    roleCode: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      // Ensure the value is always split into an array of strings
      newFormData[field] = e.target.value.split(',').map((item) => item.trim());
    } else {
      newFormData[field] = e.target.value;
    }
    setFormData(newFormData);
  };

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
          <select
            value={formData.Branch}
            onChange={(e) => handleInputChange(e, 'Branch')}
            className="rounded border border-gray-300 p-2"
          >
            <option value="">Select Branch</option>
            {Branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            value={formData.emailAddress}
            onChange={(e) => handleInputChange(e, 'emailAddress')}
            placeholder="Email"
            className="rounded border border-gray-300 p-2"
            required
          />
          <select
            value={formData.senderIds}
            onChange={(e) => handleInputChange(e, 'senderIds')}
            className="rounded border border-gray-300 p-2"
          >
            <option value="">Select Sender ID</option>
            <option>Equity Bank</option>
            <option>Finserve</option>
            <option>Equitel</option>
          </select>
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

export default RegistrationForm;
