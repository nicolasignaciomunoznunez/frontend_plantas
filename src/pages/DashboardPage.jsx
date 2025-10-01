// DashboardPage.jsx - VERSIÓN CORREGIDA
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { usePlantStore } from "../store/plantaStore";
import { formatDate } from "../utils/date";
import { useEffect, useState } from "react";
import { 
  RefreshCw, 
  AlertCircle, 
  Database, 
  User, 
  Calendar,
  LogOut,
  Activity,
  Battery,
  Gauge,
  Shield,
  MapPin,
  Building,
  Plus // ✅ AGREGAR ESTE IMPORT
} from "lucide-react";

const safeToFixed = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const num = parseFloat(value);
  return isNaN(num) ? 'N/A' : num.toFixed(1);
};

const StatCard = ({ title, value, unit, icon: Icon, color = "blue", trend, plantName }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg bg-${color}-50`}>
        <Icon className={`text-${color}-600`} size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    
    {/* Nombre de la planta */}
    {plantName && (
      <div className="mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Planta</p>
        <p className="text-sm font-medium text-gray-800 truncate" title={plantName}>
          {plantName}
        </p>
      </div>
    )}
    
    <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
    <div className="flex items-baseline">
      <p className="text-2xl font-bold text-gray-800 mr-2">{value}</p>
      <span className="text-sm text-gray-500">{unit}</span>
    </div>
  </motion.div>
);

const PlantInfoCard = ({ plantData }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg"
  >
    <div className="flex items-center space-x-3 mb-3">
      <Building className="text-white" size={24} />
      <div>
        <h3 className="text-lg font-bold">Información de la Planta</h3>
        <p className="text-blue-100 text-sm">Datos actuales del sistema</p>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
        <span className="text-blue-100 flex items-center">
          <Building className="mr-2" size={14} />
          Nombre
        </span>
        <span className="font-semibold">{plantData?.plantName || 'No disponible'}</span>
      </div>
      
      <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
        <span className="text-blue-100 flex items-center">
          <MapPin className="mr-2" size={14} />
          Ubicación
        </span>
        <span className="font-semibold">{plantData?.location || 'No disponible'}</span>
      </div>
      
      <div className="flex justify-between items-center py-2">
        <span className="text-blue-100 flex items-center">
          <Calendar className="mr-2" size={14} />
          Última lectura
        </span>
        <span className="font-semibold">
          {plantData?.timestamp ? formatDate(plantData.timestamp) : 'N/A'}
        </span>
      </div>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { latestPlantData, isLoading, error, fetchLatestPlantData, recentPlantData, fetchRecentPlantData } = usePlantStore();
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    console.log("🔍 Dashboard mounted - Checking authentication...");
    
    const token = localStorage.getItem('token');
    console.log("📋 Token in localStorage:", token ? "PRESENT" : "MISSING");
    
    // Cargar datos iniciales
    fetchLatestPlantData().then(() => {
      console.log("✅ Latest data fetched:", latestPlantData);
    });
    
    // Cargar datos recientes de todas las plantas
    fetchRecentPlantData().then(() => {
      console.log("✅ Recent data fetched:", recentPlantData);
    });
    
    setLastRefreshed(new Date());

    // Auto-refresh cada 30 segundos
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLatestPlantData();
        fetchRecentPlantData();
        setLastRefreshed(new Date());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [fetchLatestPlantData, fetchRecentPlantData, autoRefresh]);

  const handleRefresh = async () => {
    console.log("🔄 Manual refresh triggered");
    setDebugInfo("Actualizando datos manualmente...");
    
    await Promise.all([fetchLatestPlantData(), fetchRecentPlantData()]);
    setLastRefreshed(new Date());
    
    if (latestPlantData) {
      setDebugInfo(`✅ Datos actualizados: ${latestPlantData.plantName}`);
    } else {
      setDebugInfo("⚠️ No hay datos disponibles después de la actualización");
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Simular datos de tendencia
  const mockTrends = {
    nivelLocal: 2.5,
    batLocal: -1.2,
    senLocal: 0.8
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Principal */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-4 mb-4"
          >
            <div className="p-3 bg-white rounded-2xl shadow-lg">
              <img 
                className="h-16 w-auto"
                src="/images/finalogotr.png" 
                alt="Logo R&V SPA" 
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-800">R&V SPA</h1>
              <p className="text-lg text-blue-600 font-semibold">Dashboard de Monitoreo</p>
            </div>
          </motion.div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda - Información del Usuario y Planta */}
          <div className="space-y-6">
            {/* Tarjeta de Usuario */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{user?.name || 'Usuario'}</h2>
                    <p className="text-blue-100">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="mr-2" size={16} />
                    Miembro desde
                  </span>
                  <span className="font-semibold text-gray-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 flex items-center">
                    <Activity className="mr-2" size={16} />
                    Última conexión
                  </span>
                  <span className="font-semibold text-gray-800">
                    {user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Información de la Planta */}
            {latestPlantData && (
              <PlantInfoCard plantData={latestPlantData} />
            )}

            {/* Controles - VERSIÓN CORREGIDA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2" size={18} />
                Controles
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={isLoading ? 'animate-spin' : ''} size={18} />
                  <span>{isLoading ? 'Actualizando...' : 'Actualizar Datos'}</span>
                </button>
                
                {/* ✅ BOTÓN CORREGIDO: Registrar Nueva Planta */}
                <a 
                  href="/register-plant"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Plus size={18} />
                  <span>Registrar Nueva Planta</span>
                </a>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Auto-actualizar</span>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoRefresh ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoRefresh ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Columna Central - Datos de la Planta */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header de Datos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Database className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {latestPlantData?.plantName ? `Estado - ${latestPlantData.plantName}` : 'Estado del Sistema'}
                    </h2>
                    <p className="text-gray-600">
                      {latestPlantData?.location || 'Monitoreo en tiempo real'}
                    </p>
                  </div>
                </div>
                {lastRefreshed && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Última actualización</p>
                    <p className="text-sm font-semibold text-gray-700">{formatDate(lastRefreshed)}</p>
                  </div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
                >
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-red-700 font-medium">Error al cargar datos</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                  <button 
                    onClick={handleRefresh}
                    className="text-red-600 text-sm font-medium hover:text-red-700"
                  >
                    Reintentar
                  </button>
                </motion.div>
              )}

              {!isLoading && !error && latestPlantData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="Nivel Local"
                    value={safeToFixed(latestPlantData.nivelLocal)}
                    unit="units"
                    icon={Gauge}
                    color="blue"
                    trend={mockTrends.nivelLocal}
                    plantName={latestPlantData.plantName}
                  />
                  <StatCard
                    title="Batería Local"
                    value={safeToFixed(latestPlantData.batLocal)}
                    unit="V"
                    icon={Battery}
                    color="green"
                    trend={mockTrends.batLocal}
                    plantName={latestPlantData.plantName}
                  />
                  <StatCard
                    title="Sensor Local"
                    value={safeToFixed(latestPlantData.senLocal)}
                    unit="units"
                    icon={Activity}
                    color="purple"
                    trend={mockTrends.senLocal}
                    plantName={latestPlantData.plantName}
                  />
                </div>
              ) : !isLoading && !error ? (
                <div className="text-center py-12">
                  <Database className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">No hay datos disponibles</h3>
                  <p className="text-gray-400">Los datos de la planta se mostrarán aquí cuando estén disponibles</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="animate-spin text-blue-500 mr-3" size={24} />
                  <p className="text-gray-600">Cargando datos de la planta...</p>
                </div>
              )}
            </motion.div>

            {/* Sección de Múltiples Plantas (si hay datos recientes) */}
            {recentPlantData && recentPlantData.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Building className="mr-2" size={20} />
                  Otras Plantas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentPlantData.slice(1).map((plant, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{plant.plantName}</h4>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {plant.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{plant.location}</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-gray-500">Nivel</p>
                          <p className="font-semibold text-gray-800">{safeToFixed(plant.nivelLocal)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Batería</p>
                          <p className="font-semibold text-gray-800">{safeToFixed(plant.batLocal)}V</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sensor</p>
                          <p className="font-semibold text-gray-800">{safeToFixed(plant.senLocal)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;