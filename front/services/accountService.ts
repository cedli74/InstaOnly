import { getAuthHeaders } from '../helper/authHelper';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://back-instaonly-849033623078.europe-west1.run.app';
export interface Account {
  id: number;
  name: string; // Correspond au backend v2
  description: string; // Correspond au backend v2
  username?: string; // Optionnel pour compatibilité
  followers?: string;
  following?: string;
  posts?: number;
  avatar?: string;
  bio?: string;
  isConnected?: boolean;
  userId: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  mainImage?: {
    id: number;
    filename: string;
    filePath: string;
    prompt: string;
  };
  imagesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  name: string; // Correspond au backend v2
  description?: string;
  userId: number;
}

export interface UpdateAccountRequest {
  name?: string;
  description?: string;
}

export interface AccountStats {
  followers: number;
  following: number;
  posts: number;
  likes: number;
  comments: number;
  views: number;
  engagement: number;
}

export const accountService = {
  // Récupérer tous les comptes
  async getAccounts(): Promise<Account[]> {
    try {
      console.log('Fetching accounts from:', `${NEXT_PUBLIC_BACKEND_URL}/accounts`);
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/accounts`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      // Le backend v2 retourne { success: true, data: [...] }
      return result.data || result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Récupérer un compte par ID
  async getAccount(id: number): Promise<Account> {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/accounts/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Créer un nouveau compte
  async createAccount(accountData: CreateAccountRequest): Promise<Account> {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/accounts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(accountData),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Mettre à jour un compte
  async updateAccount(id: number, updateData: UpdateAccountRequest): Promise<Account> {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/accounts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Supprimer un compte
  async deleteAccount(id: number): Promise<void> {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/accounts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Définir l'image principale d'un compte
  async setMainImage(accountId: number, imageId: number): Promise<void> {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/accounts/${accountId}/main-image`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ imageId }),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Les autres méthodes restent inchangées pour la compatibilité...
  async connectInstagramAccount(code: string): Promise<Account> {
    // À implémenter avec votre logique OAuth
    throw new Error('Non implémenté dans le backend v2');
  },

  async disconnectAccount(id: number): Promise<void> {
    // À implémenter
    throw new Error('Non implémenté dans le backend v2');
  },

  async getAccountStats(id: number): Promise<AccountStats> {
    // À implémenter
    throw new Error('Non implémenté dans le backend v2');
  },

  async syncAccount(id: number): Promise<Account> {
    // À implémenter
    throw new Error('Non implémenté dans le backend v2');
  },

  async checkConnectionStatus(id: number): Promise<{ isConnected: boolean; lastSync: string }> {
    // À implémenter
    throw new Error('Non implémenté dans le backend v2');
  },
};
