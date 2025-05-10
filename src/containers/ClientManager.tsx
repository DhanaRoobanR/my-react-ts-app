import React, { useState, useEffect } from 'react';
import ClientTable from '../components/ClientTable';
import ClientForm from '../components/ClientForm';
import ConfirmDelete from '../components/ConfirmDelete';
import PaginationControls from '../components/PaginationControls';
import Toast from '../components/Toast';
import ClientAPI from '../utils/api';
import type { Client, PaginationState, ToastMessage } from '../types/client';

const ClientManager: React.FC = () => {
  // State for clients and loading
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalClients, setTotalClients] = useState<number>(0);

  // State for pagination
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });

  // State for search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // State for forms and modals
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState<boolean>(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State for toast notifications
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch clients on initial load and when pagination/search changes
  useEffect(() => {
    fetchClients();
  }, [pagination.currentPage, searchTerm]);

  // Function to fetch clients with optional search term
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const data = await ClientAPI.getClients(
        pagination.currentPage, 
        pagination.itemsPerPage, 
        searchTerm
      );
      
      setClients(data.clients);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages
      }));
      setTotalClients(data.totalClients);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to load clients. Please try again.'
      });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  // Function to show toast notifications
  const showToast = (message: ToastMessage) => {
    setToast(message);
  };

  // Function to clear toast
  const clearToast = () => {
    setToast(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page when searching
    }));
  };

  // Handle adding a new client
  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      setIsSubmitting(true);
      await ClientAPI.createClient(clientData);
      setIsAddClientModalOpen(false);
      // Reset to first page and refresh client list
      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));
      await fetchClients();
      showToast({
        type: 'success',
        message: 'Client added successfully!'
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to add client. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a client
  const handleEditClient = async (clientData: Client) => {
    try {
      setIsSubmitting(true);
      await ClientAPI.updateClient(clientData);
      setIsEditClientModalOpen(false);
      setSelectedClient(null);
      await fetchClients();
      showToast({
        type: 'success',
        message: 'Client updated successfully!'
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to update client. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a client
  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      setIsSubmitting(true);
      await ClientAPI.deleteClient(selectedClient.id);
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      
      // If we're on a page that might become empty after deletion,
      // go back to the previous page
      if (clients.length === 1 && pagination.currentPage > 1) {
        setPagination(prev => ({
          ...prev,
          currentPage: prev.currentPage - 1
        }));
      } else {
        await fetchClients();
      }
      
      showToast({
        type: 'success',
        message: 'Client deleted successfully!'
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to delete client. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal with selected client
  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsEditClientModalOpen(true);
  };

  // Open delete modal with selected client
  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Management System</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your clients with this simple CRUD application.
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
          <div className="flex items-center">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pr-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by client name..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Add Client Button */}
        <button
          onClick={() => setIsAddClientModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </button>
      </div>
      {/* Client Table */}
      <div className="mb-6">
        <ClientTable
          clients={clients}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          isLoading={isLoading}
        />
      </div>

      {/* Pagination */}
      {!isLoading && (
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          totalItems={totalClients}
        />
      )}

      {/* Add Client Modal */}
      <ClientForm
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSubmit={handleAddClient}
        isLoading={isSubmitting}
      />

      {/* Edit Client Modal */}
      <ClientForm
        isOpen={isEditClientModalOpen}
        onClose={() => {
          setIsEditClientModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleEditClient}
        client={selectedClient || undefined}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={handleDeleteClient}
        client={selectedClient}
        isLoading={isSubmitting}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
};

export default ClientManager;