// src/app/clients/new/page.tsx
'use client';

import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

const NewClientPage = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/clients', { nom, prenom, dateNaissance });
      router.push('/dashboard'); // Or maybe to a list of clients
    } catch (err) {
      setError('Failed to create client.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Create New Client</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="prenom"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="dateNaissance"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dateNaissance"
              name="dateNaissance"
              type="date"
              required
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientPage;
