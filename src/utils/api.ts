import type{ Client } from '../types/client';

const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data - this would come from a real API in a production app
let mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc.',
    email: 'john.smith@techsolutions.com',
    phoneNumber: '5551234567'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Marketing Pros',
    email: 'sarah.j@marketingpros.com',
    phoneNumber: '5559876543'
  },
  {
    id: '3',
    name: 'Michael Chen',
    company: 'Data Analytics Co.',
    email: 'mchen@dataanalytics.co',
    phoneNumber: '5552223333'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    company: 'Design Studio',
    email: 'emma@designstudio.com',
    phoneNumber: '5554445555'
  },
  {
    id: '5',
    name: 'David Garcia',
    company: 'Financial Services LLC',
    email: 'dgarcia@financialservices.com',
    phoneNumber: '5556667777'
  },
  {
    id: '6',
    name: 'Lisa Brown',
    company: 'Healthcare Solutions',
    email: 'lbrown@healthsolutions.com',
    phoneNumber: '5558889999'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    company: 'Construction Experts',
    email: 'rtaylor@construction.com',
    phoneNumber: '5551112222'
  },
  {
    id: '8',
    name: 'Sophia Martinez',
    company: 'Education Systems',
    email: 'smartinez@edusystems.com',
    phoneNumber: '5553334444'
  },
  {
    id: '9',
    name: 'James Wilson',
    company: 'Logistics International',
    email: 'jwilson@logistics.com',
    phoneNumber: '5557778888'
  },
  {
    id: '10',
    name: 'Olivia Lee',
    company: 'Retail Innovations',
    email: 'olee@retailinnovate.com',
    phoneNumber: '5559990000'
  },
  {
    id: '11',
    name: 'William Johnson',
    company: 'Legal Advisors',
    email: 'wjohnson@legaladvisors.com',
    phoneNumber: '5552468101'
  },
  {
    id: '12',
    name: 'Ava Thompson',
    company: 'Media Group',
    email: 'athompson@mediagroup.com',
    phoneNumber: '5551357924'
  }
];

// API service
const ClientAPI = {
  // Get paginated clients with search
  getClients: async (page: number = 1, itemsPerPage: number = 10, searchTerm: string = ''): Promise<{
    clients: Client[];
    totalPages: number;
    totalClients: number;
  }> => {
    await simulateDelay();
    
    // Filter by search term if provided
    const filteredClients = searchTerm 
      ? mockClients.filter(client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : mockClients;
    
    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    
    return {
      clients: paginatedClients,
      totalPages,
      totalClients: filteredClients.length
    };
  },
  
  // Create new client
  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    await simulateDelay();
    
    // Simulate error occasionally
    if (Math.random() < 0.1) {
      throw new Error('Network error while creating client');
    }
    
    const newClient = {
      ...client,
      id: String(Date.now()) // Generate unique ID
    };
    
    mockClients = [...mockClients, newClient];
    return newClient;
  },
  
  // Update client
  updateClient: async (client: Client): Promise<Client> => {
    await simulateDelay();
    
    // Simulate error occasionally
    if (Math.random() < 0.1) {
      throw new Error('Network error while updating client');
    }
    
    mockClients = mockClients.map(c => 
      c.id === client.id ? client : c
    );
    
    return client;
  },
  
  // Delete client
  deleteClient: async (id: string): Promise<void> => {
    await simulateDelay();
    
    // Simulate error occasionally
    if (Math.random() < 0.1) {
      throw new Error('Network error while deleting client');
    }
    
    mockClients = mockClients.filter(client => client.id !== id);
  }
};

export default ClientAPI;