// src/app/comptes/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

interface Compte {
  id: string;
  solde: number;
  decouvert: number;
  taux: number;
  cloture: boolean;
}

interface Operation {
  id: string;
  valeur: number;
  date: string;
  operationType: 'CREDIT' | 'DEBIT';
}

const AccountDetailsPage = () => {
  const [compte, setCompte] = useState<Compte | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [destinationAccountId, setDestinationAccountId] = useState('');

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchAccountDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const compteRes = await api.get(`/comptes/${id}`);
      setCompte(compteRes.data);

      const operationsRes = await api.get(`/comptes/${id}/operations`);
      setOperations(operationsRes.data);
    } catch (err) {
      setError('Failed to fetch account details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const handleOperation = async (operationType: 'CREDIT' | 'DEBIT') => {
    try {
      await api.post(`/comptes/${id}/operations`, { valeur: amount, operationType });
      setAmount(0);
      fetchAccountDetails();
    } catch (err) {
      console.error(err);
      setError(`Failed to perform ${operationType.toLowerCase()} operation.`);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/comptes/${id}/operations/virements`, {
        montant: transferAmount,
        idCompteDestinataire: destinationAccountId,
      });
      setTransferAmount(0);
      setDestinationAccountId('');
      fetchAccountDetails();
    } catch (err) {
      console.error(err);
      setError('Failed to perform transfer.');
    }
  };

  const handleCloseAccount = async () => {
    try {
      await api.delete(`/comptes/${id}`);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to close account.');
    }
  };


  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!compte) {
    return <p>No account data found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Account Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Information</h2>
        <p><strong>ID:</strong> {compte.id}</p>
        <p><strong>Balance:</strong> {compte.solde} €</p>
        <p><strong>Overdraft:</strong> {compte.decouvert}</p>
        <p><strong>Rate:</strong> {compte.taux}</p>
        <p><strong>Status:</strong> {compte.cloture ? 'Closed' : 'Active'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Credit/Debit</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Amount"
            />
            <div className="flex space-x-4">
              <button onClick={() => handleOperation('CREDIT')} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Credit</button>
              <button onClick={() => handleOperation('DEBIT')} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Debit</button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Transfer</h2>
          <form onSubmit={handleTransfer} className="flex flex-col space-y-4">
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Amount"
              required
            />
            <input
              type="text"
              value={destinationAccountId}
              onChange={(e) => setDestinationAccountId(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Destination Account ID"
              required
            />
            <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Transfer</button>
          </form>
        </div>
      </div>

      {!compte.cloture && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Close Account</h2>
          <button onClick={handleCloseAccount} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Close this account</button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Operations</h2>
        <ul className="space-y-4">
          {operations.map((operation) => (
            <li key={operation.id} className="border-b pb-2">
              <p><strong>Operation ID:</strong> {operation.id}</p>
              <p><strong>Date:</strong> {new Date(operation.date).toLocaleString()}</p>
              <p><strong>Type:</strong> {operation.operationType}</p>
              <p><strong>Amount:</strong> <span className={operation.operationType === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>{operation.valeur} €</span></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
