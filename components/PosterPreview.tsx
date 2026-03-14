import React from 'react';
import { CarouselSlide } from '../types';
import { ICON_MAP } from './IconLibrary';
import { QrCode, Coins, Clock } from 'lucide-react';

interface Props {
  slide: CarouselSlide;
  id?: string;
}

const PosterPreview: React.FC<Props> = ({ slide, id }) => {
  const { themeColors } = slide;

  return (
    <div
      id={id}
      className="poster-preview font-arabic"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text
      }}
    >
      {/* Dynamic CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: slide.customCss || '' }} />

      {/* Header with Background and Logos */}
      <div className="poster-header">
        <img
          src={slide.topImage}
          alt="Top Header"
          className="poster-image"
          crossOrigin="anonymous"
        />
        <div
          className="poster-header-overlay"
          style={{
            background: `linear-gradient(to top, ${themeColors.primary}EE 85%, ${themeColors.primary}44 100%)`,
            opacity: 1
          }}
        ></div>

        {/* Logos */}
        <div className="poster-logos">
           <div className="logo-box">
             <span>منصة التاجر</span>
           </div>

           {slide.brandLogo ? (
             <div className="logo-box right">
                <img
                  src={slide.brandLogo}
                  alt="Brand Logo"
                  style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
                  crossOrigin="anonymous"
                />
             </div>
           ) : (
             <div className="logo-box right">
                {/* Empty or previous logo if preferred */}
             </div>
           )}
        </div>

        {/* Title Overlay */}
        <div className="poster-title-container">
          <h2 className="poster-title">
            {slide.title}
          </h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="poster-content">
        {/* Optional User Logo Floating in corner */}
        {slide.logoImage && (
          <div className="user-logo-container">
             <div className="user-logo-box">
               <img
                 src={slide.logoImage}
                 alt="User Logo"
                 className="user-logo-img"
                 crossOrigin="anonymous"
               />
             </div>
          </div>
        )}

        {/* Description Text */}
        <p
          className="poster-desc"
          style={{
            borderColor: themeColors.secondary,
            color: themeColors.text
          }}
        >
          {slide.description}
        </p>

        {/* Specializations Section */}
        <div className="poster-specs-section">
          <div className="poster-specs-header">
             <span
               className="poster-specs-badge"
               style={{ backgroundColor: themeColors.secondary }}
             >
               التخصصات المطلوبة:
             </span>
             <div
               className="poster-specs-divider"
               style={{ backgroundColor: themeColors.secondary, opacity: 0.4 }}
             ></div>
          </div>

          <div className="poster-specs-grid">
            {slide.specializations.map((spec) => (
              <div key={spec.id} className="poster-spec-item">
                <div
                  className="poster-spec-icon-box"
                  style={{
                    backgroundColor: themeColors.background === '#FFFFFF' || themeColors.background === '#ffffff' ? '#F8FAFC' : 'rgba(255,255,255,0.08)',
                    borderColor: `${themeColors.secondary}33`,
                    color: themeColors.primary
                  }}
                >
                  {ICON_MAP[spec.icon] || ICON_MAP['other']}
                </div>
                <span
                  className="poster-spec-name"
                  style={{ color: themeColors.text }}
                >
                  {spec.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div
        className="poster-footer"
        style={{
          backgroundColor: themeColors.background === '#FFFFFF' || themeColors.background === '#ffffff' ? '#F8FAFC' : 'rgba(0,0,0,0.15)',
          borderColor: 'rgba(0,0,0,0.06)'
        }}
      >
        <div className="poster-details">
           <div className="poster-duration-row">
             <div className="poster-duration-box" style={{ color: themeColors.primary }}>
               <Clock className="poster-duration-icon" size={20} />
               <div className="poster-duration-box">
                 <span className="poster-duration-value">{slide.duration}</span>
                 <span className="poster-duration-label">مدة التدريب:</span>
               </div>
             </div>
           </div>

           <div
             className="poster-incentives-box"
             style={{
               backgroundColor: themeColors.background === '#FFFFFF' || themeColors.background === '#ffffff' ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
               borderColor: `${themeColors.secondary}44`,
               color: themeColors.primary
             }}
           >
             <p className="poster-incentives-text">
               {slide.incentives}
             </p>
             <Coins size={22} style={{ color: themeColors.primary }} />
           </div>
        </div>

        <div className="poster-qr-container">
          <div
            className="poster-qr-text"
            style={{ color: themeColors.text, opacity: 0.75 }}
          >
            {slide.qrCodeText}
          </div>
          <div className="poster-qr-box">
            {slide.qrCodeImage ? (
              <img 
                src={slide.qrCodeImage} 
                alt="QR Code" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                crossOrigin="anonymous"
              />
            ) : (
              <QrCode className="poster-qr-icon" style={{ color: themeColors.primary }} strokeWidth={1.2} />
            )}
          </div>
        </div>
      </div>

      {/* Brand Stripe Footer */}
      <div
        className="poster-brand-footer"
        style={{
          backgroundColor: themeColors.background === '#FFFFFF' || themeColors.background === '#ffffff' ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)',
          color: themeColors.text
        }}
      >
        <span className="right-brand" style={{ color: themeColors.primary }}>منصة التاجر</span>
        <span className="left-brand">dtajer.com</span>
      </div>
    </div>
  );
};

export default PosterPreview;
