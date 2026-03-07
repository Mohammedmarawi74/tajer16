
import React from 'react';
import { 
  Briefcase, GraduationCap, Users, ShieldAlert, BadgeDollarSign, 
  Megaphone, Wheat, Settings, LayoutGrid, Cpu, Languages, Scale, Globe
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ReactNode> = {
  "admin": <Briefcase className="w-6 h-6" />,
  "education": <GraduationCap className="w-6 h-6" />,
  "hr": <Users className="w-6 h-6" />,
  "risk": <ShieldAlert className="w-6 h-6" />,
  "finance": <BadgeDollarSign className="w-6 h-6" />,
  "media": <Megaphone className="w-6 h-6" />,
  "agri": <Wheat className="w-6 h-6" />,
  "mgmt": <Settings className="w-6 h-6" />,
  "it": <Cpu className="w-6 h-6" />,
  "lang": <Languages className="w-6 h-6" />,
  "law": <Scale className="w-6 h-6" />,
  "global": <Globe className="w-6 h-6" />,
  "other": <LayoutGrid className="w-6 h-6" />
};

export const IconsList = Object.keys(ICON_MAP);
