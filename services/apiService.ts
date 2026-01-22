
const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  async checkStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch { return false; }
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async get(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/${endpoint}?${query}`);
    return response.json();
  },

  async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
