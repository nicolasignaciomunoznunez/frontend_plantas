import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api/planta' 
  : '/api/planta';

export const usePlantStore = create((set, get) => ({
  plantData: [],
  latestPlantData: null,
  recentPlantData: [], // ✅ NUEVO: Para múltiples plantas
  isLoading: false,
  error: null,

  // Obtener todos los datos de la planta
  fetchPlantData: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ 
        plantData: [...response.data.data],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar datos de planta', 
        isLoading: false 
      });
    }
  },

  // Obtener el último dato de la planta
  fetchLatestPlantData: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/latest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // ✅ SOLUCIÓN: Forzar nueva referencia incluso si los datos son iguales
      const newData = response.data.data ? { ...response.data.data } : null;
      
      set({ 
        latestPlantData: newData, 
        isLoading: false 
      });
      
      console.log('🔄 Últimos datos actualizados en store:', newData);
      
    } catch (error) {
      console.error('Error fetching latest plant data:', error);
      set({ 
        error: error.response?.data?.message || 'Error al cargar datos recientes', 
        isLoading: false 
      });
    }
  },

  // ✅ NUEVO: Obtener datos recientes de todas las plantas
  fetchRecentPlantData: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/recent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ 
        recentPlantData: [...response.data.data],
        isLoading: false 
      });
      
      console.log('🔄 Datos recientes actualizados en store:', response.data.data);
      
    } catch (error) {
      console.error('Error fetching recent plant data:', error);
      set({ 
        error: error.response?.data?.message || 'Error al cargar datos recientes', 
        isLoading: false 
      });
    }
  },

  // ✅ Limpiar errores
  clearError: () => set({ error: null }),

  // ✅ Limpiar todos los datos
  clearData: () => set({ 
    plantData: [], 
    latestPlantData: null, 
    recentPlantData: [],
    error: null 
  }),
}));