
export interface Specialization {
  id: string;
  name: string;
  icon: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  background: string;
}

export interface CarouselSlide {
  id: string;
  topImage: string;
  logoImage?: string;
  title: string;
  description: string;
  specializations: Specialization[];
  duration: string;
  incentives: string;
  qrCodeText: string;
  customCss?: string;
  themeColors: ThemeColors;
  brandLogo?: string;
}

export interface CarouselState {
  slides: CarouselSlide[];
  currentIndex: number;
}
