import React, { useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, Download, Wand2, Image as ImageIcon,
  ChevronRight, ChevronLeft, Save, PlusCircle, LayoutPanelTop,
  Type, Palette, Code2, Sparkles, Clock, Coins, UploadCloud, CheckCircle2, Loader2, QrCode
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { CarouselSlide, Specialization, ThemeColors } from './types';
import PosterPreview from './components/PosterPreview';
import { IconsList } from './components/IconLibrary';
import { generateSlideContent, generateHeaderImage } from './services/geminiService';
import './index.css';

// Brand Logos Import
import logo1 from './logooo/logo-1.png';
import logo2 from './logooo/logo-2.png';
import logo3 from './logooo/logo-3.png';
import logo4 from './logooo/logo-4.png';

const BRAND_LOGOS = [
  { id: '1', src: logo1 },
  { id: '2', src: logo2 },
  { id: '3', src: logo3 },
  { id: '4', src: logo4 },
];

// Al-Tajer Digital Modern Theme Presets
const PRESET_THEMES: { name: string; colors: ThemeColors }[] = [
  {
    name: 'الأزرق الاحترافي',
    colors: { primary: '#2563EB', secondary: '#3B82F6', text: '#0F172A', background: '#FFFFFF' }
  },
  {
    name: 'الكحلي الحديث',
    colors: { primary: '#1E3A8A', secondary: '#3B82F6', text: '#1E293B', background: '#F8FAFC' }
  },
  {
    name: 'النعناع المنعش',
    colors: { primary: '#059669', secondary: '#10B981', text: '#0F172A', background: '#FFFFFF' }
  },
  {
    name: 'البنفسجي العميق',
    colors: { primary: '#7C3AED', secondary: '#8B5CF6', text: '#1E1B4B', background: '#F5F3FF' }
  },
  {
    name: 'الأزرق السماوي',
    colors: { primary: '#0891B2', secondary: '#06B6D4', text: '#164E63', background: '#ECFEFF' }
  },
  {
    name: 'الرمادي الأنيق',
    colors: { primary: '#475569', secondary: '#64748B', text: '#0F172A', background: '#FFFFFF' }
  },
  {
    name: 'البرتقالي الحيوي',
    colors: { primary: '#EA580C', secondary: '#F97316', text: '#431407', background: '#FFF7ED' }
  },
  {
    name: 'الوضع الداكن',
    colors: { primary: '#3B82F6', secondary: '#10B981', text: '#F1F5F9', background: '#1E293B' }
  }
];

const INITIAL_SLIDE: CarouselSlide = {
  id: '1',
  topImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=600',
  title: 'فرص تدريبية في برنامج تطوير الخريجين (تمهير)',
  description: 'تدعوكم وزارة البيئة والمياه والزراعة، بالتعاون مع صندوق تنمية الموارد البشرية، للانضمام إلى برنامج (تمهير) المخصص لتأهيل الكوادر الوطنية الشابة وتمكينهم من اكتساب المهارات العملية اللازمة لسوق العمل السعودي الحديث.',
  specializations: [
    { id: 's1', name: 'الموارد البشرية', icon: 'hr' },
    { id: 's2', name: 'إدارة المخاطر', icon: 'risk' },
    { id: 's3', name: 'المحاسبة والمالية', icon: 'finance' },
    { id: 's4', name: 'الإعلام والاتصال', icon: 'media' },
    { id: 's5', name: 'البيئة والمياه', icon: 'agri' },
    { id: 's6', name: 'إدارة المشاريع', icon: 'mgmt' },
    { id: 's7', name: 'نظم المعلومات', icon: 'it' },
    { id: 's8', name: 'القانون', icon: 'law' },
  ],
  duration: '6 أشهر',
  incentives: 'مكافأة مالية شهرية مقدمة من صندوق هدف للموارد البشرية',
  qrCodeText: 'للتسجيل والاطلاع على كافة الشروط، يرجى مسح الرمز والتوجه لموقع صندوق التنمية',
  customCss: '',
  themeColors: {
    primary: '#2563EB',
    secondary: '#3B82F6',
    text: '#0F172A',
    background: '#FFFFFF'
  },
  brandLogo: logo1
};

type TabType = 'ai' | 'content' | 'design' | 'custom';

const App: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([INITIAL_SLIDE]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('design');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const currentSlide = slides[activeSlideIndex];
  const posterRef = useRef<HTMLDivElement>(null);

  const updateSlide = useCallback((updates: Partial<CarouselSlide>) => {
    setSlides(prev => prev.map((s, i) => i === activeSlideIndex ? { ...s, ...updates } : s));
  }, [activeSlideIndex]);

  const updateColors = (newColors: Partial<ThemeColors>) => {
    updateSlide({ themeColors: { ...currentSlide.themeColors, ...newColors } });
  };

  const addSlide = () => {
    const newSlide = { ...INITIAL_SLIDE, id: Date.now().toString() };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const [content, image] = await Promise.all([
        generateSlideContent(aiPrompt),
        generateHeaderImage(aiPrompt)
      ]);

      const updatedSpecs: Specialization[] = content.specializations.map((name: string, i: number) => ({
        id: `gen-${i}`,
        name,
        icon: IconsList[i % IconsList.length]
      }));

      updateSlide({
        title: content.title,
        description: content.description,
        specializations: updatedSpecs,
        duration: content.duration,
        incentives: content.incentives,
        topImage: image || currentSlide.topImage
      });
      setActiveTab('content');
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPng = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 3,
        quality: 1.0,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `al-tajer-carousel-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed", error);
      alert("حدث خطأ أثناء التصدير. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'topImage' | 'logoImage' | 'qrCodeImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSlide({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app-container font-arabic">
      {/* Sidebar Editor */}
      <aside className="sidebar-editor">
        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button onClick={() => setActiveTab('ai')} className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}>
            <Sparkles size={18} />
            <span>الذكاء</span>
          </button>
          <button onClick={() => setActiveTab('content')} className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}>
            <Type size={18} />
            <span>النصوص</span>
          </button>
          <button onClick={() => setActiveTab('design')} className={`tab-button ${activeTab === 'design' ? 'active' : ''}`}>
            <Palette size={18} />
            <span>التصميم</span>
          </button>
          <button onClick={() => setActiveTab('custom')} className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}>
            <Code2 size={18} />
            <span>تخصيص</span>
          </button>
        </div>

        <div className="sidebar-content custom-scrollbar">
          {activeTab === 'ai' && (
            <section className="ai-section animate-fade-in">
              <div className="ai-card">
                <label className="ai-label">
                  <Wand2 size={20} /> توليد المحتوى الذكي
                </label>
                <textarea
                  placeholder="اكتب موضوع الإعلان (مثلاً: مهندس مدني في نيوم)..."
                  className="ai-textarea"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="ai-button"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <>ابدأ التوليد الفوري <Sparkles size={18} /></>}
                </button>
              </div>
            </section>
          )}

          {activeTab === 'content' && (
            <div className="form-section animate-fade-in">
              <div className="input-group">
                <label className="input-label">العنوان الرئيسي (36px)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={currentSlide.title}
                  onChange={(e) => updateSlide({ title: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">الوصف الاحترافي (18px)</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={currentSlide.description}
                  onChange={(e) => updateSlide({ description: e.target.value })}
                />
              </div>

              <div className="input-grid">
                <div className="input-group">
                  <label className="input-label">مدة التدريب</label>
                  <input
                    className="form-input"
                    value={currentSlide.duration}
                    onChange={(e) => updateSlide({ duration: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">المزايا</label>
                  <input
                    className="form-input"
                    value={currentSlide.incentives}
                    onChange={(e) => updateSlide({ incentives: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="form-section animate-fade-in">
              <div className="input-group">
                <h3 className="input-label" style={{ textAlign: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px', color: 'var(--text-headline)' }}>الثيمات الجاهزة</h3>
                <div className="theme-grid">
                  {PRESET_THEMES.map((theme) => {
                    const isActive = JSON.stringify(currentSlide.themeColors) === JSON.stringify(theme.colors);
                    return (
                      <button
                        key={theme.name}
                        onClick={() => updateSlide({ themeColors: theme.colors })}
                        className={`theme-card ${isActive ? 'active' : ''}`}
                      >
                        {isActive && <div className="theme-check"><CheckCircle2 size={16} /></div>}
                        <div className="theme-header">
                           <div className="theme-dot-container">
                              <div className="theme-dot" style={{ backgroundColor: theme.colors.secondary }}></div>
                              <div className="theme-dot" style={{ backgroundColor: theme.colors.primary }}></div>
                           </div>
                           <span className="theme-name">{theme.name}</span>
                        </div>
                        <div className="theme-preview-bar">
                           <div style={{ backgroundColor: theme.colors.background, width: '60%' }}></div>
                           <div style={{ backgroundColor: theme.colors.primary, width: '40%' }}></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="input-group">
                <h3 className="input-label" style={{ textAlign: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px', color: 'var(--text-headline)' }}>تخصيص الألوان</h3>
                <div className="color-grid">
                  {(['primary', 'secondary', 'text', 'background'] as const).map((key) => (
                    <div key={key} className="input-group">
                      <label className="input-label" style={{ textAlign: 'center' }}>{key === 'primary' ? 'الأساسي' : key === 'secondary' ? 'الثانوي' : key === 'text' ? 'النصوص' : 'الخلفية'}</label>
                      <div className="color-picker-wrapper">
                         <input
                          type="color"
                          className="color-input"
                          value={currentSlide.themeColors[key]}
                          onChange={(e) => updateColors({ [key]: e.target.value })}
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <h3 className="input-label" style={{ textAlign: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px', color: 'var(--text-headline)' }}>شعار الجهة (أعلى اليمين)</h3>
                <div className="brand-logo-grid">
                  {BRAND_LOGOS.map((logo) => (
                    <div
                      key={logo.id}
                      className={`brand-logo-card ${currentSlide.brandLogo === logo.src ? 'active' : ''}`}
                      onClick={() => updateSlide({ brandLogo: logo.src })}
                    >
                      <img src={logo.src} alt={`Logo ${logo.id}`} />
                    </div>
                  ))}
                </div>
                {currentSlide.brandLogo && (
                  <button
                    className="remove-logo-btn"
                    onClick={() => updateSlide({ brandLogo: undefined })}
                  >
                    إزالة الشعار كلياً
                  </button>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">الخلفية، الشعار ورمز QR</label>
                <div className="upload-box-container" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <label className="upload-box">
                    {currentSlide.topImage && <img src={currentSlide.topImage} alt="Cover" />}
                    <div className="overlay">
                      <ImageIcon size={20} />
                      <span>صورة الغلاف</span>
                    </div>
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, 'topImage')} />
                  </label>
                  <label className="upload-box">
                    {currentSlide.logoImage && <img src={currentSlide.logoImage} alt="Logo" style={{ objectFit: 'contain', padding: '8px', opacity: 0.5 }} />}
                    <div className="overlay">
                      <UploadCloud size={20} />
                      <span>إضافة لوغو</span>
                    </div>
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, 'logoImage')} />
                  </label>
                  <label className="upload-box">
                    {currentSlide.qrCodeImage && <img src={currentSlide.qrCodeImage} alt="QR" style={{ objectFit: 'contain', padding: '8px', opacity: 0.5 }} />}
                    <div className="overlay">
                      <QrCode size={20} />
                      <span>رفع رمز QR</span>
                    </div>
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, 'qrCodeImage')} />
                  </label>
                </div>
              </div>

              <div className="input-group">
                <div className="section-header">
                   <label className="input-label">التخصصات (Icons)</label>
                   <button onClick={() => updateSlide({ specializations: [...currentSlide.specializations, { id: Date.now().toString(), name: 'تخصص جديد', icon: 'other' }] })} className="add-button">
                     <PlusCircle size={22} />
                   </button>
                </div>
                <div className="items-list custom-scrollbar">
                  {currentSlide.specializations.map((spec, idx) => (
                    <div key={spec.id} className="list-item">
                      <select value={spec.icon} onChange={(e) => {
                        const newSpecs = [...currentSlide.specializations];
                        newSpecs[idx].icon = e.target.value;
                        updateSlide({ specializations: newSpecs });
                      }}>
                        {IconsList.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <input value={spec.name} onChange={(e) => {
                        const newSpecs = [...currentSlide.specializations];
                        newSpecs[idx].name = e.target.value;
                        updateSlide({ specializations: newSpecs });
                      }} />
                      <button onClick={() => updateSlide({ specializations: currentSlide.specializations.filter((_, i) => i !== idx) })} className="delete-button">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="form-section animate-fade-in">
              <div className="input-group">
                <label className="input-label">محرر الأنماط CSS المتقدم</label>
                <textarea
                  className="custom-css-editor"
                  dir="ltr"
                  placeholder="/* Custom CSS overrides here */"
                  value={currentSlide.customCss}
                  onChange={(e) => updateSlide({ customCss: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button
            disabled={isExporting}
            className="export-button"
            onClick={handleExportPng}
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
            تصدير كصورة احترافية (PNG)
          </button>
          <button
            className="pdf-button"
            onClick={() => window.print()}
          >
            <Download size={14} /> حفظ كملف (PDF)
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="canvas-area">
        <div className="pagination-bar">
           <button disabled={activeSlideIndex === 0} onClick={() => setActiveSlideIndex(activeSlideIndex - 1)} className="pagination-nav-btn"><ChevronRight /></button>
           <div className="dots-container">
             {slides.map((_, i) => (
               <div
                key={i}
                onClick={() => setActiveSlideIndex(i)}
                className={`dot-indicator ${i === activeSlideIndex ? 'active' : 'inactive'}`}
               />
             ))}
           </div>
           <button onClick={addSlide} className="add-button" style={{ marginLeft: '8px' }}><PlusCircle size={20}/></button>
           <button disabled={activeSlideIndex === slides.length - 1} onClick={() => setActiveSlideIndex(activeSlideIndex + 1)} className="pagination-nav-btn"><ChevronLeft /></button>
        </div>

        <div className="poster-viewport animate-slide-up">
           <div
             className="poster-glow"
             style={{ backgroundColor: currentSlide.themeColors.primary }}
           />
           <div id="poster-to-export" ref={posterRef}>
             <PosterPreview slide={currentSlide} />
           </div>

           <div className="floating-actions">
             <button onClick={handleExportPng} className="action-btn export"><Download size={24}/></button>
             <button onClick={() => removeSlide(activeSlideIndex)} className="action-btn delete"><Trash2 size={24}/></button>
           </div>
        </div>

        <p className="canvas-info">IBM Plex Sans Arabic | 300 DPI Export Enabled | Al-Tajer Digital</p>
      </main>
    </div>
  );
};

export default App;
