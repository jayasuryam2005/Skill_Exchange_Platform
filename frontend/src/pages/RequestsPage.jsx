import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RequestCard from '../components/RequestCard';
import { Repeat, Send, Inbox, CheckCircle2, Loader2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const endpoint = activeTab === 'received' ? '/requests/received' : '/requests/sent';
      const response = await api.get(endpoint);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      const response = await api.put(`/requests/${id}`, { status: 'accepted' });
      if (response.data.success) {
        toast.success('Request accepted! Session added to your schedule.');
        fetchRequests(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to accept request');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.put(`/requests/${id}`, { status: 'rejected' });
      if (response.data.success) {
        toast.error('Request declined.');
        fetchRequests(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Repeat className="h-7 w-7 text-primary-600 mr-2" /> Exchange Requests
        </h1>
        <p className="text-gray-500 mt-1">Manage your incoming and outgoing skill exchange offers.</p>
      </div>

      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 max-w-md">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'received' 
              ? 'bg-primary-600 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Inbox className="h-4 w-4 mr-2" /> Received
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'sent' 
              ? 'bg-primary-600 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Send className="h-4 w-4 mr-2" /> Sent
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <RequestCard 
              key={req._id || req.id} 
              request={req} 
              activeTab={activeTab}
              onAccept={handleAccept} 
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          title={`No ${activeTab} requests`}
          message={activeTab === 'received' 
            ? "You haven't received any skill exchange requests yet. Try optimizing your profile!" 
            : "You haven't sent any requests yet. Explore potential matches to get started!"}
          actionText={activeTab === 'sent' ? "Find Matches" : "Edit Profile"}
          onAction={() => window.location.href = activeTab === 'sent' ? '/matches' : '/profile/edit'}
        />
      )}
    </div>
  );
};

export default RequestsPage;
