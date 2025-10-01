import { motion } from "framer-motion";
import { useState } from "react";
import { usePlantStore } from "../store/plantStore"; // Nuevo store para plantas
import { useAuthStore } from "../store/authStore";
import { 
  Plus, 
  MapPin, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle,
  Loader
} from "lucide-react";

const PlantRegistration = () => {
  const { user } = useAuthStore();
  const { createPlant, isLoading, error } = usePlantStore();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createPlant(formData);
      setFormData({ name: "", location: "", description: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error al crear planta:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4">
            <Building className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Registrar Nueva Planta
          </h1>
          <p className="text-gray-600">
            Agrega una nueva planta al sistema de monitoreo
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre de la Planta */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="mr-2" size={16} />
                Nombre de la Planta *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Ej: Planta Principal, Planta Norte..."
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="mr-2" size={16} />
                Ubicación *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Ej: Sede Central, Zona Industrial..."
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="mr-2" size={16} />
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe las características de esta planta..."
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <XCircle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-red-700 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Mensaje de Éxito */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-green-700 font-medium">¡Éxito!</p>
                  <p className="text-green-600 text-sm">Planta registrada correctamente</p>
                </div>
              </motion.div>
            )}

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Registrar Planta</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Información Adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-200"
        >
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Building className="mr-2" size={18} />
            Información importante
          </h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• La planta se creará automáticamente como activa</li>
            <li>• Serás asignado como propietario (owner) de esta planta</li>
            <li>• Podrás agregar usuarios adicionales después del registro</li>
            <li>• Los datos de monitoreo comenzarán a aparecer en el dashboard</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default PlantRegistration;