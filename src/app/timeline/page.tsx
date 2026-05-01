'use client';

import Navbar from '@/components/Navbar';
import ElectionTimeline from '@/components/ElectionTimeline';

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />
      <div className="pt-24 max-w-3xl mx-auto px-4 pb-24">
        <ElectionTimeline />
      </div>
    </div>
  );
}
