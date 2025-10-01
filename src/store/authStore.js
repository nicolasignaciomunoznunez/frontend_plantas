// store/authStore.js - VERSIÓN CORREGIDA PARA MYSQL
import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

// Configuración de axios para MySQL
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			console.log('📤 Enviando signup a:', `${API_URL}/signup`);
			
			const response = await axios.post(`${API_URL}/signup`, { 
				email, 
				password, 
				name 
			});
			
			console.log('✅ Respuesta del backend:', response.data);
			
			// ✅ ADAPTACIÓN MYSQL: Verificar success primero
			if (!response.data.success) {
				throw new Error(response.data.message || "Error en el registro");
			}
			
			// ✅ ADAPTACIÓN MYSQL: El token viene en response.data.token
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				console.log('🔑 Token guardado en localStorage');
			}
			
			// ✅ ADAPTACIÓN MYSQL: Los datos del usuario vienen en response.data.user
			set({ 
				user: response.data.user, 
				isAuthenticated: true, 
				isLoading: false,
				error: null 
			});
			
			return response.data;
		} catch (error) {
			console.error('❌ Error en signup:', error);
			
			// ✅ MEJOR MANEJO DE ERRORES PARA MYSQL
			const errorMessage = error.response?.data?.message || 
							   error.response?.data?.error ||
							   error.message || 
							   "Error en el registro";
			
			set({ 
				error: errorMessage, 
				isLoading: false 
			});
			throw new Error(errorMessage);
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			
			// ✅ ADAPTACIÓN MYSQL: Verificar success primero
			if (!response.data.success) {
				throw new Error(response.data.message || "Error en el login");
			}
			
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				console.log('🔑 Token guardado en localStorage durante login');
			}
			
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
			
			return response.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || 
							   error.response?.data?.error ||
							   error.message || 
							   "Error en el login";
			
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			
			// ✅ IMPORTANTE: Eliminar el token al cerrar sesión
			localStorage.removeItem('token');
			console.log('🔑 Token eliminado de localStorage durante logout');
			
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			// Aún así limpiar el token localmente aunque falle el logout en el servidor
			localStorage.removeItem('token');
			set({ error: "Error", isLoading: false });
			throw error;
		}
	},

	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			
			// ✅ ADAPTACIÓN MYSQL: Verificar success primero
			if (!response.data.success) {
				throw new Error(response.data.message || "Error en la verificación");
			}
			
			// ✅ Guardar token si se recibe en la verificación de email
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				console.log('🔑 Token guardado en localStorage durante verifyEmail');
			}
			
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || 
							   error.response?.data?.error ||
							   error.message || 
							   "Error en la verificación";
			
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			
			// ✅ ADAPTACIÓN MYSQL: Verificar success primero
			if (!response.data.success) {
				throw new Error(response.data.message || "Error verificando autenticación");
			}
			
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				console.log('🔑 Token actualizado durante checkAuth');
			}
			
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			console.log('🔐 No autenticado o error verificando auth');
			localStorage.removeItem('token');
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			
			// ✅ ADAPTACIÓN MYSQL: Verificar success primero
			if (!response.data.success) {
				throw new Error(response.data.message || "Error enviando email de recuperación");
			}
			
			set({ message: response.data.message, isLoading: false });
			return response.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || 
							   error.response?.data?.error ||
							   error.message || 
							   "Error enviando el reset de contraseña";
			
			set({
				isLoading: false,
				error: errorMessage,
			});
			throw new Error(errorMessage);
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			
			// ✅ ADAPTACIÓN MYSQL: Verificar success primero
			if (!response.data.success) {
				throw new Error(response.data.message || "Error reseteando contraseña");
			}
			
			// ✅ Guardar token si se recibe al resetear contraseña
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				console.log('🔑 Token guardado en localStorage durante resetPassword');
			}
			
			set({ message: response.data.message, isLoading: false });
			return response.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || 
							   error.response?.data?.error ||
							   error.message || 
							   "Error reseteando la contraseña";
			
			set({
				isLoading: false,
				error: errorMessage,
			});
			throw new Error(errorMessage);
		}
	},
}));