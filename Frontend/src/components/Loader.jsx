import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ fullPage = false, size = 32 }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <Loader2 className="animate-spin-slow" size={size} color="#3b82f6" />
      <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500' }}>Loading...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0f19' }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {content}
    </div>
  );
};

export default Loader;
