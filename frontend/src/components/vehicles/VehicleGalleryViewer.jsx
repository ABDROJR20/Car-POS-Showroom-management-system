import React, { useState } from 'react';
import { Tag, Maximize2, Star } from 'lucide-react';

export const VehicleGalleryViewer = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]?.url || '');
  const [activeAngleFilter, setActiveAngleFilter] = useState('ALL');

  if (!images || images.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No photos uploaded for this vehicle asset yet.
      </div>
    );
  }

  const filteredImages = activeAngleFilter === 'ALL'
    ? images
    : images.filter((img) => img.viewAngle === activeAngleFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Featured Big Showcase Display */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '340px',
          backgroundColor: '#05080F',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-medium)',
        }}
      >
        <img
          src={selectedImage || images[0]?.url}
          alt="Selected View"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Angle Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['ALL', 'Front', 'Back', 'Left', 'Right', 'Interior', 'Engine'].map((angle) => (
          <button
            key={angle}
            type="button"
            onClick={() => setActiveAngleFilter(angle)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: activeAngleFilter === angle ? '1px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
              background: activeAngleFilter === angle ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface-elevated)',
              color: activeAngleFilter === angle ? 'var(--brand-gold)' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {angle}
          </button>
        ))}
      </div>

      {/* Thumbnail Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
        {filteredImages.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => setSelectedImage(img.url)}
            style={{
              height: '80px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              border: (selectedImage === img.url || (!selectedImage && idx === 0))
                ? '2px solid var(--brand-gold)'
                : '1px solid var(--border-subtle)',
              position: 'relative',
            }}
          >
            <img src={img.url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {img.viewAngle && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '2px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#FFF',
                  fontSize: '0.625rem',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontWeight: 600,
                }}
              >
                {img.viewAngle}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
