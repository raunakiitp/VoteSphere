'use client';

import Navbar from '@/components/Navbar';
import DocumentValidator from '@/components/DocumentValidator';

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-24">
        <DocumentValidator />
      </div>
    </div>
  );
}
