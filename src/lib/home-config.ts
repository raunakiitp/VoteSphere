import { 
  Bot, CheckSquare, MapPin, FileText, 
  Clock, MessageCircle, Users, Building2, 
  Radio, Globe 
} from 'lucide-react';

export const FEATURE_HREFS = ['/journey', '/eligibility', '/map', '/documents', '/timeline', '/faq'];

export const STATS = {
  en: [
    { label: 'Registered Voters',  value: '96.8 Cr', icon: Users },
    { label: 'Constituencies',     value: '543',      icon: Building2 },
    { label: 'Polling Stations',   value: '10.5 L',   icon: Radio },
    { label: 'States & UTs',       value: '36',        icon: Globe },
  ],
  hi: [
    { label: 'पंजीकृत मतदाता',  value: '96.8 Cr', icon: Users },
    { label: 'निर्वाचन क्षेत्र',     value: '543',      icon: Building2 },
    { label: 'मतदान केंद्र',   value: '10.5 L',   icon: Radio },
    { label: 'राज्य और केंद्र शासित',       value: '36',        icon: Globe },
  ]
};

export const FEATURES = {
  en: [
    { icon: Bot,           title: 'AI Civic Guide',          desc: 'Gemini-powered assistant answering your election questions in real-time with bilingual support.',           color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/15' },
    { icon: CheckSquare,   title: 'Smart Eligibility Engine', desc: 'Instant eligibility assessment with AI probability scoring based on Indian electoral law.',                 color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
    { icon: MapPin,        title: 'Polling Intelligence Map', desc: 'Locate nearby polling stations with crowd prediction levels and optimal voting time windows.',              color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/15' },
    { icon: FileText,      title: 'Document Validator',       desc: 'Verify which of 12 ECI-approved documents you need and receive instant AI validation feedback.',            color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/15' },
    { icon: Clock,         title: 'Live Election Timeline',   desc: 'Real-time countdown to Election Day with color-coded milestones and personalised deadline tracking.',       color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/15' },
    { icon: MessageCircle, title: 'AI FAQ Engine',            desc: 'Semantic search across curated election FAQs, or ask Gemini AI any civic question instantly.',             color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/15' },
  ],
  hi: [
    { icon: Bot,           title: 'AI नागरिक गाइड',          desc: 'रीयल-टाइम में द्विभाषी समर्थन के साथ आपके चुनाव संबंधी सवालों के जवाब देने वाला Gemini-संचालित सहायक।',           color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/15' },
    { icon: CheckSquare,   title: 'स्मार्ट पात्रता इंजन',    desc: 'भारतीय चुनाव कानून के आधार पर AI प्रायिकता स्कोरिंग के साथ त्वरित पात्रता मूल्यांकन।',                 color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
    { icon: MapPin,        title: 'मतदान मानचित्र',          desc: 'भीड़ की भविष्यवाणी और मतदान के इष्टतम समय के साथ आस-पास के मतदान केंद्र खोजें।',              color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/15' },
    { icon: FileText,      title: 'दस्तावेज़ सत्यापन',       desc: 'सत्यापित करें कि आपको 12 ECI-अनुमोदित दस्तावेज़ों में से किसकी आवश्यकता है और त्वरित प्रतिक्रिया प्राप्त करें।', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/15' },
    { icon: Clock,         title: 'लाइव चुनाव समयरेखा',     desc: 'रंग-कोडित मील के पत्थर और व्यक्तिगत समय सीमा ट्रैकिंग के साथ चुनाव दिवस की वास्तविक समय की उलटी गिनती।',       color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/15' },
    { icon: MessageCircle, title: 'AI सामान्य प्रश्न इंजन',  desc: 'चुनाव संबंधी सामान्य प्रश्नों में खोजें, या Gemini AI से कोई भी नागरिक प्रश्न तुरंत पूछें।',             color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/15' },
  ]
};

export const HOME_TEXT = {
  en: {
    heroTag: 'Powered by Google Gemini · Firebase · Google Maps',
    hero1: 'Your Intelligent',
    hero2: 'Election Companion',
    heroSub: 'VoteSphere guides every Indian citizen through the electoral process — from awareness to participation — using AI, real-time data, and civic intelligence.',
    btnStart: 'Begin Your Civic Journey',
    btnCheck: 'Check Eligibility',
    featTag: 'Platform Features',
    featTitle: 'Complete Election Intelligence',
    featSub: 'Six AI-powered tools to guide every citizen through the democratic process',
    powerTag: 'Powered By'
  },
  hi: {
    heroTag: 'Google Gemini · Firebase · Google Maps द्वारा संचालित',
    hero1: 'आपका बुद्धिमान',
    hero2: 'चुनाव साथी',
    heroSub: 'VoteSphere AI, रीयल-टाइम डेटा और नागरिक बुद्धिमत्ता का उपयोग करके चुनाव प्रक्रिया - जागरूकता से भागीदारी तक - के माध्यम से हर भारतीय नागरिक का मार्गदर्शन करता है।',
    btnStart: 'अपनी नागरिक यात्रा शुरू करें',
    btnCheck: 'पात्रता जांचें',
    featTag: 'प्लेटफ़ॉर्म सुविधाएँ',
    featTitle: 'संपूर्ण चुनाव बुद्धिमत्ता',
    featSub: 'लोकतांत्रिक प्रक्रिया के माध्यम से हर नागरिक का मार्गदर्शन करने के लिए छह AI-संचालित उपकरण',
    powerTag: 'द्वारा संचालित'
  }
};
