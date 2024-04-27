'use client';
// components/Form.tsx
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
import { environment } from '@/environment/environment';

const aestutils = new Aesutils();

interface ClientDetails {
  clientName: string;
  country: string;
  clientEmail: string;
  clientPhone: string;
  physicalAddress: string;
  postalAddress: string;
  postalCode: string;
  businessType: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
}

interface Document {
  base64ImageData: string;
  documentType: string;
  mimetype: string;
  documentName: string;
}

interface FormData {
  clientDetails: ClientDetails;
  userInfo: UserInfo;
  documents: Document[];
}

const Form = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const countries = [
    { code: 'KE', name: 'Kenya' },
    { code: 'UG', name: 'Uganda' },
    { code: 'TZ', name: 'Tanzania' },
    // Add more countries as needed
  ];

  const [formData, setFormData] = useState<FormData>({
    clientDetails: {
      clientName: '',
      country: 'KE',
      clientEmail: '',
      clientPhone: '',
      physicalAddress: '',
      postalAddress: '',
      postalCode: '',
      businessType: '',
    },
    userInfo: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      password: '',
    },
    documents: [
      {
        base64ImageData: '',
        documentType: '',
        mimetype: '',
        documentName: '',
      },
    ],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    category: keyof FormData,
    field: string,
  ) => {
    const newFormData = { ...formData };
    (newFormData[category] as any)[field] = e.target.value;
    setFormData(newFormData);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const filePromises = files.map(async (file) => {
        const base64 = await convertToBase64(file);
        return {
          base64ImageData: base64 as string,
          documentType: 'termsAndConditions', // Assuming fixed documentType, adjust as necessary
          mimetype: file.type,
          documentName: file.name,
        };
      });

      const documents = await Promise.all(filePromises);

      setFormData({
        ...formData,
        documents: [...formData.documents, ...documents],
      });
    }
  };

  const convertToBase64 = (
    file: File,
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const dev_url = environment.dev_url;

    // Encrypt the form data
    const secretKey = 'jWh60R71wb0HN2saj6mD3Rh8BQ4EUf';
    const encryptedPassword = await aestutils.encrypt(
      secretKey,
      formData.userInfo.password,
    );
    const decryptedPassword = await aestutils.decrypt(
      secretKey,
      encryptedPassword,
    );
    console.log('Paswword before Encryption', formData.userInfo.password);
    console.log('Encrypted password', encryptedPassword);
    console.log('Decrypted password', decryptedPassword);
    console.log(formData.userInfo.password);
    const newForm = {
      ...formData,
      userInfo: {
        ...formData.userInfo,
        password: encryptedPassword,
      },
    };
    setFormData(newForm);
    console.log(newForm);
    console.log('Encrypted Data:', formData);
    console.log(encryptedPassword);

    try {
      const response = await fetch(`${dev_url}/api/v1/client-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForm),
      });

      if (response.ok) {
        setSuccessMessage('Form submitted successfully');
        window.location.href = '/login';
        // Handle success behavior here, like redirecting or showing a success message
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set error message state
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error behavior here
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-300 p-3">
      <h2 className="bg-white-500 mb-4 flex justify-center rounded-lg p-2 text-xl font-semibold text-white">
        <img
          src="https://www.finserve.africa/images/finserve-big-logo.svg"
          alt="Finserve Logo"
          className="h-15 w-15 mr-2"
        />
        Sign up Form
      </h2>
      <h1 className="mx-auto text-center font-bold">Bulk-sms</h1>
      <h2 className="mb-4">Sign-up</h2>

      <div className="mb-2 flex">
        <button
          className={`flex-1 p-2 ${activeTab === 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange(0)}
        >
          Client Details
        </button>
        <button
          className={`flex-1 p-2 ${activeTab === 1 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange(1)}
        >
          User Info
        </button>
        <button
          className={`flex-1 p-2 ${activeTab === 2 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange(2)}
        >
          Documents
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {activeTab === 0 && (
          <div className="flex flex-wrap gap-4">
            {/* First column */}
            <div className="flex w-1/2 flex-col gap-4">
              {/* First row */}
              <div className="flex gap-4">
                {/* Client Name */}
                <input
                  type="text"
                  value={formData.clientDetails.clientName}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'clientName')
                  }
                  placeholder="Client Name"
                  className="flex-1 border border-gray-300 p-2"
                  required
                />

                {/* Country Dropdown */}
                <select
                  value={formData.clientDetails.country}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'country')
                  }
                  className="flex-1 border border-gray-300 p-2"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second row */}
              <div className="flex gap-4">
                {/* Client Email */}
                <input
                  type="email"
                  value={formData.clientDetails.clientEmail}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'clientEmail')
                  }
                  placeholder="Client Email"
                  className="flex-1 border border-gray-300 p-2"
                />

                {/* Client Phone */}
                <input
                  type="tel"
                  value={formData.clientDetails.clientPhone}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'clientPhone')
                  }
                  placeholder="Client Phone"
                  className="flex-1 border border-gray-300 p-2"
                />
              </div>
            </div>

            {/* Second column */}
            <div className="flex w-1/2 flex-col gap-4">
              {/* Third row */}
              <div className="flex gap-4">
                {/* Physical Address */}
                <input
                  type="text"
                  value={formData.clientDetails.physicalAddress}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'physicalAddress')
                  }
                  placeholder="Physical Address"
                  className="flex-1 border border-gray-300 p-2"
                />

                {/* Postal Address */}
                <input
                  type="text"
                  value={formData.clientDetails.postalAddress}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'postalAddress')
                  }
                  placeholder="Postal Address"
                  className="flex-1 border border-gray-300 p-2"
                />
              </div>

              {/* Fourth row */}
              <div className="flex gap-4">
                {/* Postal Code */}
                <input
                  type="text"
                  value={formData.clientDetails.postalCode}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'postalCode')
                  }
                  placeholder="Postal Code"
                  className="flex-1 border border-gray-300 p-2"
                />
              </div>
              {/* Business Type Selection */}
              <div className="flex gap-4">
                <select
                  value={formData.clientDetails.businessType}
                  onChange={(e) =>
                    handleInputChange(e, 'clientDetails', 'businessType')
                  }
                  className="flex-1 border border-gray-300 p-2"
                >
                  <option value="">Select Business Type</option>
                  <option value="type1">Sole Proprietorship</option>
                  <option value="type2">Limited Liability</option>
                  <option value="type3">Patnership</option>
                  {/* Add other business types as needed */}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="flex flex-col gap-4">
            {/* First Name */}
            <input
              type="text"
              value={formData.userInfo.firstName}
              onChange={(e) => handleInputChange(e, 'userInfo', 'firstName')}
              placeholder="First Name"
              className="border border-gray-300 p-2"
            />

            {/* Last Name */}
            <input
              type="text"
              value={formData.userInfo.lastName}
              onChange={(e) => handleInputChange(e, 'userInfo', 'lastName')}
              placeholder="Last Name"
              className="border border-gray-300 p-2"
            />

            {/* Email Address */}
            <input
              type="email"
              value={formData.userInfo.emailAddress}
              onChange={(e) => handleInputChange(e, 'userInfo', 'emailAddress')}
              placeholder="Email Address"
              className="border border-gray-300 p-2"
            />

            {/* Phone Number */}
            <input
              type="tel"
              value={formData.userInfo.phoneNumber}
              onChange={(e) => handleInputChange(e, 'userInfo', 'phoneNumber')}
              placeholder="Phone Number"
              className="border border-gray-300 p-2"
            />

            {/* Password */}
            <input
              type="password"
              value={formData.userInfo.password}
              onChange={(e) => handleInputChange(e, 'userInfo', 'password')}
              placeholder="Password"
              className="border border-gray-300 p-2"
            />
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {/* Conditionally display document fields based on businessType */}
            {formData.clientDetails.businessType === 'type1' && (
              <div>
                <p>Sole Proprietorship document:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            {formData.clientDetails.businessType === 'type2' && (
              <div>
                <p>Limited Liability document:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            {formData.clientDetails.businessType === 'type3' && (
              <div>
                <p>Patnership document:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            {/* Add more conditions for other business types as necessary */}
          </div>
        )}

        <div className="flex justify-center px-16">
          {activeTab === 0 && (
            <button
              type="button"
              onClick={() => handleTabChange(1)}
              className="mt-4 flex items-center justify-center gap-1 rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              <ArrowRightIcon className="h-5 w-5" /> Next
            </button>
          )}
          {activeTab === 1 && (
            <button
              type="button"
              onClick={() => handleTabChange(2)}
              className="mt-4 flex items-center justify-center gap-1 rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              <ArrowRightIcon className="h-5 w-5" /> Next
            </button>
          )}
          {activeTab === 2 && (
            <button
              type="submit"
              className="mt-4 rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Submit
            </button>
          )}
        </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
      {/* Link to the login page */}
      <div className="mb-2 text-center text-blue-500 hover:underline">
        <Link href="/login">Already have an account? Login here.</Link>
      </div>
      {successMessage && (
        <div
          className="flex items-center space-x-2"
          aria-live="polite"
          aria-atomic="true"
        >
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <p className="text-sm text-green-500">{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
