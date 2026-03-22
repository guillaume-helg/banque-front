// src/app/clients/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

interface Client {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

const ClientDetailsPage = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [solde, setSolde] = useState(0);
  const [decouvert, setDecouvert] = useState(0);
  const [taux, setTaux] = useState(0);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        const clientRes = await api.get(`/clients/${id}`);
        setClient(clientRes.data);
      } catch (err) {
        setError('Failed to fetch client details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  const handleCreateAccount = async (e: React.FormEtag) => {
    e.preventDefault();
    setError('');

    try {
      await api.post(`/clients/${id}/comptes`, { solde, decouvert, taux });
      // Redirect to the dashboard or the new account page
      router.push(`/dashboard`);
    } catch (err) {
      setError('Failed to create account.');
      console.error(err);
    }
  };


  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!client) {
    return <p>No client data found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Client Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Client Information</h2>
        <p><strong>ID:</strong> {client.id}</p>
        <p><strong>Name:</strong> {client.prenom} {client.nom}</p>
        <p><strong>Date of Birth:</strong> {new Date(client.dateNaissance).toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Create New Account</h2>
        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div>
            <label htmlFor="solde" className="block text-sm font-medium text-gray-700">Initial Balance</label>
            <input
              id="solde"
              name="solde"
              type="number"
              required
              value={solde}
              onChange={(e) => setSolde(Number(e.target.value))}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="decouvert" className="block text-sm font-medium text-gray-700">Overdraft</label>
            <input
              id="decouvert"
              name="decouvert"
              type="number"
              required
              value={decouvert}
              onChange={(e) => setDecouvert(Number(e.target.value))}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="taux" className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              id="taux"
              name="taux"
              type="number"
              required
              value={taux}
              onChange={(e) => setTaux(Number(e.target.value))}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
