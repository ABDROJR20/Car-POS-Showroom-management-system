import React, { useState, useRef } from 'react';
import { UploadCloud, X, Star, Image as ImageIcon } from 'lucide-react';

const VIEW_ANGLES = [
  { value: 'FRONT', label: 'Front' },
  { value: 'BACK', label: 'Rear' },
  { value: 'LEFT', label: 'Left Side' },
  { value: 'RIGHT', label: 'Right Side' },
  { value: 'INTERIOR_DASHBOARD', label: 'Interior Dashboard' },
  { value: 'INTERIOR_SEATS', label: 'Interior Seats' },
  { value: 'ENGINE_BAY', label: 'Engine Bay' },
  { value: 'TRUNK', label: 'Trunk / Boot' },
  { value: 'DEFECT', label: 'Dent / Scratch' },
];

export const ImageUploader = ({
  images = [],
  onChange,
  maxImages = 15,
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const newImgs = [...images];
    Array.from(files).forEach((file) => {
      if (newImgs.length >= maxImages) return;
      if (!file.type.startsWith('image/')) return;

      const previewUrl = URL.createObjectURL(file);
      newImgs.push({
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        file,
        previewUrl,
        viewAngle: 'FRONT',
        isPrimary: newImgs.length === 0, // First uploaded image is default primary
      });
    });

    if (onChange) onChange(newImgs);
  };

  const removeImage = (id) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    if (onChange) onChange(filtered);
  };

  const setPrimary = (id) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    if (onChange) onChange(updated);
  };

  const updateAngle = (id, angle) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, viewAngle: angle } : img
    );
    if (onChange) onChange(updated);
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--brand-gold)' : 'var(--border-medium)'}`,
          backgroundColor: dragOver ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          marginBottom: '16px',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <UploadCloud size={24} color="#F59E0B" />
        </div>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Drag and drop vehicle photos here, or click to browse
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          JPG, PNG or WEBP up to 10MB each ({images.length}/{maxImages} uploaded)
        </p>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {images.map((img) => (
            <div
              key={img.id}
              className="surface-card"
              style={{
                overflow: 'hidden',
                position: 'relative',
                border: img.isPrimary ? '1px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
              }}
            >
              {/* Image Thumbnail */}
              <div style={{ position: 'relative', width: '100%', height: '120px', background: '#000' }}>
                <img
                  src={img.previewUrl || img.url}
                  alt="Vehicle View"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
                {img.isPrimary && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'var(--brand-gold)',
                      color: '#000',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Star size={10} fill="#000" /> Cover Photo
                  </div>
                )}
              </div>

              {/* Angle selector & Primary Trigger */}
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <select
                  className="form-select"
                  style={{ fontSize: '0.75rem', padding: '4px 6px', height: '28px' }}
                  value={img.viewAngle}
                  onChange={(e) => updateAngle(img.id, e.target.value)}
                >
                  {VIEW_ANGLES.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>

                {!img.isPrimary && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '0.6875rem', padding: '2px', color: 'var(--text-muted)' }}
                    onClick={() => setPrimary(img.id)}
                  >
                    Set as Cover Photo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
