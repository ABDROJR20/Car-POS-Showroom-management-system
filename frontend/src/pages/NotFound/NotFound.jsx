import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Home } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '32px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Car size={36} color="#F59E0B" />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Showroom Terminal Page Not Found
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '24px' }}>
        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
        <Home size={16} /> Return to Dashboard
      </button>
    </div>
  );
};
