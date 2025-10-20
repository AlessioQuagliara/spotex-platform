import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface LayoutAgencyProps {
  children: ReactNode;
}

export function LayoutAgency({ children }: LayoutAgencyProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}