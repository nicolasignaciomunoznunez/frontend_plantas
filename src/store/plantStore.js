import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api/plants' 
  : '/api/plants';

export const usePlantStore = create((set, get) => ({
  plants: [],
  currentPlant: null,
  isLoading: false,
  error: null,

  // Crear nueva planta
  createPlant: async (plantData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.post(`${API_URL}`, plantData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        set({ 
          isLoading: false,
          error: null
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear la planta';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw new Error(errorMessage);
    }
  },

  // Obtener todas las plantas del usuario
  fetchUserPlants: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/my-plants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ 
        plants: response.data.data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar plantas', 
        isLoading: false 
      });
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),

  // Limpiar todo el estado
  clearState: () => set({ 
    plants: [], 
    currentPlant: null, 
    error: null, 
    isLoading: false 
  }),
}));