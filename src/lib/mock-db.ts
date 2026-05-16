// Simulated Database for Local Development
// Used when Supabase URL is not configured

interface Order {
  id: string;
  email: string;
  full_name: string;
  status: string;
  document_type: string;
  category: string;
  amount: number;
  created_at: string;
  urgency: string;
}

class MockDB {
  private orders: Order[] = [];

  constructor() {
    // Add some initial mock data
    this.orders = [
      {
        id: 'LD-XJ29A',
        email: 'client@example.com',
        full_name: 'John Doe',
        status: 'delivered',
        document_type: 'Rental Agreement',
        category: 'Agreements',
        amount: 499,
        urgency: 'standard',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'LD-PR88B',
        email: 'test@example.com',
        full_name: 'Jane Smith',
        status: 'processing',
        document_type: 'General Affidavit',
        category: 'Affidavits',
        amount: 299,
        urgency: 'express',
        created_at: new Date().toISOString(),
      }
    ];
  }

  getOrders() {
    return this.orders;
  }

  getOrder(id: string, email?: string) {
    return this.orders.find(o => o.id === id && (!email || o.email === email));
  }

  addOrder(order: any) {
    const newOrder = { ...order, created_at: new Date().toISOString() };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateStatus(id: string, status: string) {
    const order = this.orders.find(o => o.id === id);
    if (order) order.status = status;
    return order;
  }
}

export const mockDb = new MockDB();
