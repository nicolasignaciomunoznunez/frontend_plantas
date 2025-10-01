import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import PublicLayout from "./components/PublicLayout";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

// Layout para páginas públicas (login, signup, etc.)
const PublicPageLayout = ({ children }) => (
  <PublicLayout>
    {children}
  </PublicLayout>
);

// Layout para páginas privadas (dashboard, etc.)
const PrivatePageLayout = ({ children }) => (
  <div className="min-h-screen bg-white flex flex-col">
    <header className="bg-blue-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            className="h-36 w-auto"
            src="/images/finalogotr.png" 
            alt="Logo R&V SPA" 
          />
          <h1 className="text-2xl font-bold"></h1>
        </div>
      </div>
    </header>

    <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative overflow-hidden">
      <FloatingShape color='bg-blue-200' size='w-64 h-64' top='10%' left='5%' delay={0} />
      <FloatingShape color='bg-blue-300' size='w-48 h-48' top='70%' left='85%' delay={5} />
      <FloatingShape color='bg-blue-100' size='w-32 h-32' top='40%' left='-5%' delay={2} />
      {children}
    </main>

    <footer className="bg-blue-900 text-white py-6 text-center">
      <div className="container mx-auto">
        <p className="text-lg font-semibold">ESPECIALISTAS EN SOLUCIONES INTEGRALES</p>
        <p className="mt-2">Para el buen funcionamiento de plantas de agua potable</p>
        <p className="mt-1 text-blue-200">Innovación y experiencia al servicio de tu comunidad</p>
        
        <div className="mt-6 border-t border-blue-700 pt-4">
          <p className="mt-2 text-sm text-blue-100">
            Proyectos y soluciones integrales adaptadas a tus necesidades industriales, 
            optimizando recursos y garantizando eficiencia en cada proyecto.
          </p>
        </div>
      </div>
    </footer>
  </div>
);

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    console.log("🔄 App - Iniciando checkAuth...");
    checkAuth().then(() => {
      console.log("✅ App - checkAuth completado");
      console.log("📊 App - Estado actual:", {
        isAuthenticated,
        isCheckingAuth,
        user: user ? `${user.name} (${user.email})` : 'NO USER'
      });
    });
  }, [checkAuth]);

  useEffect(() => {
    console.log("📈 App - Estado actualizado:", {
      isCheckingAuth,
      isAuthenticated,
      user: user ? `${user.name} (${user.email})` : 'NO USER'
    });
  }, [isCheckingAuth, isAuthenticated, user]);

  if (isCheckingAuth) {
    console.log("⏳ App - Mostrando LoadingSpinner...");
    return <LoadingSpinner />;
  }

  console.log("🎯 App - Renderizando rutas...");

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <PrivatePageLayout>
                <DashboardPage />
              </PrivatePageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <RedirectAuthenticatedUser>
              <PublicPageLayout>
                <SignUpPage />
              </PublicPageLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/login'
          element={
            <RedirectAuthenticatedUser>
              <PublicPageLayout>
                <LoginPage />
              </PublicPageLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route 
          path='/verify-email' 
          element={
            <PublicPageLayout>
              <EmailVerificationPage />
            </PublicPageLayout>
          } 
        />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthenticatedUser>
              <PublicPageLayout>
                <ForgotPasswordPage />
              </PublicPageLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/reset-password/:token'
          element={
            <RedirectAuthenticatedUser>
              <PublicPageLayout>
                <ResetPasswordPage />
              </PublicPageLayout>
            </RedirectAuthenticatedUser>
          }
        />
        {/* catch all routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      
      <Toaster />
    </>
  );
}

export default App;