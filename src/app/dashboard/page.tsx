// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import Spinner from '@/components/Spinner';

interface Client {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

interface Compte {
  id: string;
  solde: number;
  decouvert: number;
  taux: number;
  cloture: boolean;
}

const DashboardPage = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // The task.md mentions that we need a way to get the current user's ID.
        // For now, I will hardcode the client ID.
        // In a real application, this should be retrieved from the authentication context.
        const clientId = '1'; 
        const clientRes = await api.get(`/clients/${clientId}`);
        setClient(clientRes.data);

        const comptesRes = await api.get(`/clients/${clientId}/comptes`);
        setComptes(comptesRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <h1 className="text-3xl font-bold mb-4">Welcome, {client.prenom} {client.nom}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Client Information</h2>
        <p><strong>ID:</strong> {client.id}</p>
        <p><strong>Date of Birth:</strong> {new Date(client.dateNaissance).toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Bank Accounts</h2>
        <ul className="space-y-4">
          {comptes.map((compte) => (
            <li key={compte.id} className="border-b pb-2">
              <Link href={`/comptes/${compte.id}`} className="text-blue-500 hover:underline">
                  Account ID: {compte.id}
              </Link>
              <p><strong>Balance:</strong> {compte.solde} €</p>
              <p><strong>Overdraft:</strong> {compte.decouvert}</p>
              <p><strong>Rate:</strong> {compte.taux}</p>
              <p><strong>Status:</strong> {compte.cloture ? 'Closed' : 'Active'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
