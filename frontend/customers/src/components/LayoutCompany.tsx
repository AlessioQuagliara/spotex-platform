import type { ReactNode } from 'react';
import Sidebar2 from '../components/Sidebar2';

interface LayoutCompanyProps {
  children: ReactNode;
}

export function LayoutCompany({ children }: LayoutCompanyProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar2 />
      <main className="flex-1 lg:ml-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}