import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();
		await login(email, password);
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
			<div className="flex items-center justify-center min-h-screen p-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="w-full max-w-md"
				>
					{/* Card Container */}
					<div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
						{/* Header con gradiente */}
						<div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-center">
							<motion.h2 
								initial={{ scale: 0.9 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring" }}
								className="text-3xl font-bold text-white mb-2"
							>
								Bienvenido
							</motion.h2>
							<p className="text-blue-100 text-sm">
								Ingresa a tu cuenta para continuar
							</p>
						</div>

						{/* Formulario */}
						<div className="p-8">
							<form onSubmit={handleLogin} className="space-y-6">
								{/* Campo Email */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
								>
									<Input
										icon={Mail}
										type="email"
										placeholder="Correo electrónico"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</motion.div>

								{/* Campo Contraseña */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="relative"
								>
									<Input
										icon={Lock}
										type={showPassword ? "text" : "password"}
										placeholder="Contraseña"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</motion.div>

								{/* Enlace olvidar contraseña */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className="flex justify-end"
								>
									<Link 
										to="/forgot-password" 
										className="text-sm text-blue-300 hover:text-white transition-colors hover:underline"
									>
										¿Olvidaste tu contraseña?
									</Link>
								</motion.div>

								{/* Mensaje de error */}
								{error && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-red-500/20 border border-red-500/50 rounded-lg p-3"
									>
										<p className="text-red-300 text-sm font-medium text-center">
											{error}
										</p>
									</motion.div>
								)}

								{/* Botón de login */}
								<motion.button
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
									whileHover={{ 
										scale: 1.02,
										boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)"
									}}
									whileTap={{ scale: 0.98 }}
									className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									type="submit"
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center justify-center space-x-2">
											<Loader className="w-5 h-5 animate-spin" />
											<span>Iniciando sesión...</span>
										</div>
									) : (
										"Iniciar sesión"
									)}
								</motion.button>
							</form>
						</div>

						{/* Footer */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
							className="px-8 py-6 bg-black/20 border-t border-white/10"
						>
							<p className="text-center text-gray-300 text-sm">
								¿No tienes una cuenta?{" "}
								<Link 
									to="/signup" 
									className="text-blue-400 hover:text-white font-semibold transition-colors hover:underline"
								>
									Regístrate aquí
								</Link>
							</p>
						</motion.div>
					</div>

					{/* Texto adicional opcional */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
						className="text-center mt-6"
					>
						<p className="text-gray-400 text-sm">
							© 2025 R&V SPA. Todos los derechos reservados.
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default LoginPage;