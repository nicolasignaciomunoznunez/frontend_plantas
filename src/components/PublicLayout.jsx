// components/PublicLayout.jsx
import FloatingShape from "./FloatingShape";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <FloatingShape color='bg-blue-200' size='w-64 h-64' top='10%' left='5%' delay={0} />
      <FloatingShape color='bg-blue-300' size='w-48 h-48' top='70%' left='85%' delay={5} />
      <FloatingShape color='bg-blue-100' size='w-32 h-32' top='40%' left='-5%' delay={2} />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;