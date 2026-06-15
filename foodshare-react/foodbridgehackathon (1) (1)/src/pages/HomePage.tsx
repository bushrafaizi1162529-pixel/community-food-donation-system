/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage } from '../types';
import { 
  Heart, MapPin, Award, ShieldCheck, CheckCircle, Truck, HelpCircle, Users, Sparkles, Send, 
  ArrowRight, Globe, Leaf, Compass, Calendar, Phone, Mail, Check, ShieldAlert
} from 'lucide-react';

// Local translations dictionary supporting multiple languages for About Us and enriched content
const LOCAL_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    about_title: "Our Story & Core Mission",
    about_subtitle: "Bridging the surplus food gap with dignity, certified safety, and community trust.",
    about_card_title: "Who We Are",
    about_card_body: "FoodBridge is a government-trusted, technology-driven initiative connecting local surplus food providers (hotels, restaurants, event organizers, families) with verified local NGO networks and community kitchens. We do not just route food — we track ecological footprints, ensure certified safety compliance, and mobilize hyper-local logistics to make sure no safe plate of food goes to waste.",
    about_mission_title: "Our Zero Hunger Vision",
    about_mission_desc: "We align with UN SDG 2 (Zero Hunger) and SDG 13 (Climate Action). By transforming waste into nourishment, we feed vulnerable families while cutting harmful landfill methane emissions.",
    about_val1_title: "Vetted Food Security",
    about_val1_desc: "Rigorous standards for food preservation, temperature storage guidelines, and verified timing guarantees to maintain health compliance.",
    about_val2_title: "Hyperlocal Smart Dispatch",
    about_val2_desc: "Intelligent proximity-alert routing connects donors with the nearest active NGO kitchens within minutes to secure fresh meals.",
    about_val3_title: "Ecological Stewardship",
    about_val3_desc: "Every claim directly computes methane and CO₂ reductions, tracking a visible record of environmental preservation. Every 50kg plants virtual trees."
  },
  te: {
    about_title: "మన కథ & ముఖ్య సంకల్పం",
    about_subtitle: "గౌరవం, భద్రత మరియు సామాజిక నమ్మకంతో ఆహార కొరతను నివారించడం.",
    about_card_title: "మనం ఎవరు",
    about_card_body: "ఫుడ్‌బ్రిడ్జ్ అనేది ప్రభుత్వ గుర్తింపు పొందిన, సాంకేతిక పరిజ్ఞానంతో కూడిన ఒక విశేष వేదిక. ఇది హోటళ్లు, రెస్టారెంట్లు మరియు గృహాలలోని మిగిలిపోయిన ఆహారాన్ని ధృవీకరించబడిన స్థానిక స్వచ్ఛంద సంస్థల (NGOs) కి అనుసంధానిస్తుంది. మనం కేవలం ఆహారాన్ని పంపడమే కాదు, పర్యావరణ రక్షణ గణాంకాలను నమోదు చేస్తూ, వేగవంతమైన రవాణాను అందిస్తాము.",
    about_mission_title: "ఆకలి లేని సమాజం",
    about_mission_desc: "ఐక్యరాజ్యసమితి నిర్దేశించిన శూన్య ఆకలి (UN SDG 2) మరియు పర్యావరణ పరిరక్షణ (SDG 13) లక్ష్య సాధనలో మేము భాగస్వాములము. పర్యావరణానికి కీడు చేసే వ్యర్థాలను తగ్గించి పేదలకు పౌష్టికాహారాన్ని అందిస్తాము.",
    about_val1_title: "భద్రత మరియు ప్రమాణాలు",
    about_val1_desc: "సరైన ఆహార ఉష్ణోగ్రత మరియు గడువు సమయ పర్యవేక్షణతో కూడిన నిరంతర నాణ్యత పరిశీలన జరుగుతుంది.",
    about_val2_title: "స్థానిక రవాణా వ్యవస్థ",
    about_val2_desc: "మహావేగవంతమైన అల్గారిథమ్ సహాయంతో సమీప స్వచ్ఛంద శాలలకి కొన్ని నిమిషాలలోనే హెచ్చరికలు అందుతాయి.",
    about_val3_title: "పర్యావరణ సమతుల్యత",
    about_val3_desc: "ప్రತಿ సేవ మీ ప్రొഫൈల్‌లో అద్భుతమైన పర్యాവరణ హిత సూచీలుగా ఆదా అవుతుంది."
  },
  hi: {
    about_title: "हमारी कहानी और मुख्य उद्देश्य",
    about_subtitle: "गरिमा, सुरक्षा और सामुदायिक विश्वास के साथ भोजन की बर्बादी को रोकना।",
    about_card_title: "हम कौन हैं",
    about_card_body: "फूडब्रिज एक सरकारी-विश्वस्त तकनीक-संचालित पहल है जो स्थानीय खाद्य प्रदाताओं (होटल, रेस्तरां, परिवार) को सत्यापित सामाजिक संगठनों (NGOs) से जोड़ता है। हम केवल भोजन वितरित नहीं करते बल्कि प्रत्येक स्तर पर कार्बन उत्सर्जन बचत और लॉजिस्टिक्स की सुरक्षा सुचारू रूप से ट्रैक करते हैं।",
    about_mission_title: "शून्य भुखमरी का संकल्प",
    about_mission_desc: "हम संयुक्त राष्ट्र के 'जीरो हंगर' (SDG 2) और 'क्लाइमेट एक्शन' (SDG 13) के लक्ष्यों के साथ कार्य करते हैं। बचे हुए भोजन को पोषण में बदलकर हम परिवारों की मदद करते हैं और मीथेन उत्सर्जन से धरती को बचाते हैं।",
    about_val1_title: "सत्यापित सुरक्षा मानक",
    about_val1_desc: "खाद्य भंडारण, तापमान नियंत्रण और सुरक्षा दिशानिर्देशों का सर्वोच्च स्तर पर अनुपालन सुनिश्चित किया जाता है।",
    about_val2_title: "अति-स्थानीय प्रेषण",
    about_val2_desc: "इंटेलिजेंट जीपीएस राउटिंग के जरिए नजदीकी सामाजिक रसोई दल को कुछ ही मिनटों में सूचना मिल जाती है।",
    about_val3_title: "हरित पर्यावरण संरक्षण",
    about_val3_desc: "हर दान सीधे आपके प्रोफाइल पर बचाए गए CO₂ और कम किए गए अपशिष्ट के आंकड़े दर्ज करता है।"
  },
  kn: {
    about_title: "ನಮ್ಮ ಕಥೆ ಮತ್ತು ಪ್ರಮುಖ ಧ್ಯೇಯ",
    about_subtitle: "ಗೌರವ, ಭದ್ರತೆ ಮತ್ತು ಸಮುದಾಯದ ಬದ್ಧತೆಯೊಂದಿಗೆ ಹೆಚ್ಚುವರಿ ಆಹಾರ ಸರಿಪಡಿಸುವುದು.",
    about_card_title: "ನಾವು ಯಾರು",
    about_card_body: "ಫುಡ್‌ಬ್ರಿಡ್ಜ್ ಸರ್ಕಾರಿ ಮಾನ್ಯತೆ ಪಡೆದ, ತಂತ್ರಜ್ಞಾನ ಆಧಾರಿತ ಸಾಮಾಜಿಕ ಶಕ್ತಿಯಾಗಿದೆ. ಇದು ಸ್ಥಳೀಯ ಆಹಾರ ಪ್ರದಾತರನ್ನು (ಹೋಟೆಲ್‌ಗಳು, ಮದುವೆ ಸಮಾರಂಭಗಳು, ಮನೆಗಳು) ಧೃಢೀಕೃತ ಸ್ಥಳೀಯ ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ (NGOs) ಸಂಪರ್ಕಿಸುತ್ತದೆ. ಇದು ಕೇವಲ ಆಹಾರ ವಿತರಣೆಯಲ್ಲ, ಹೈಪರ್-ಲೋಕಲ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ಪರಿಸರ ಉಳಿಕೆಯ ನೈಜ ದಾಖಲೆಯಾಗಿದೆ.",
    about_mission_title: "ಶೂನ್ಯ ಹಸಿವಿನ ಕನಸು",
    about_mission_desc: "ನಾವು UN SDG 2 (ಶೂನ್ಯ ಹಸಿವು) ಮತ್ತು SDG 13 (ಪರಿಸರ ಸಂರಕ್ಷಣೆ) ಉದ್ದೇಶಗಳೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುತ್ತೇವೆ. ತ್ಯಾಜ್ಯವನ್ನು ಪೌಷ್ಟಿಕ ಆಹಾರವನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ ಸಮುದಾಯದ ಪ್ರಗತಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.",
    about_val1_title: "ಸುರಕ್ಷತೆಯ ಖಾತರಿ",
    about_val1_desc: "ಆಹಾರದ ತಾಪಮಾನ, ತಾಜಾತನ ಮತ್ತು ಶೇಖರಣಾ ಮಾನದಂಡಗಳ ಬಗ್ಗೆ ನಿರಂತರ ತಪಾಸಣೆ ಕೈಗೊಳ್ಳಲಾಗುವುದು.",
    about_val2_title: "ವೇಗದ ರವಾನೆ ಮಾರ್ಗ",
    about_val2_desc: "ಸೂಕ್ಷ್ಮ ಸಾಮೀಪ್ಯ ಎಚ್ಚರಿಕೆಗಳ ಮೂಲಕ ಹತ್ತಿರದ ಗ್ರಾಮೀಣ ಅಡುಗೆ ಕೋಣೆಗಳಿಗೆ ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಸಂದೇಶ ತಲುಪುತ್ತದೆ.",
    about_val3_title: "ಹಸಿರು ಪರಿಸರ ರಕ್ಷಣೆ",
    about_val3_desc: "ನಿಮ್ಮ ಪ್ರತಿ ಆಹಾರ ಕೊಡುಗೆಯು ಪರಿಸರ ಇಂಗಾಲ ಕಡಿತದ ಸುವರ್ಣ ಪಾಯಿಂಟ್‌ಗಳಾಗಿ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಸೇರುತ್ತದೆ."
  },
  ml: {
    about_title: "ഞങ്ങളുടെ കഥയും ദൗത്യവും",
    about_subtitle: "മാന്യതയോടും സുരക്ഷിതത്വത്തോടും കൂടിയ സാമൂഹിക പട്ടിണി നിർമ്മാർജ്ജനം.",
    about_card_title: "ഞങ്ങൾ ആരാണ്",
    about_card_body: "ഭക്ഷണ ബാക്കി വരുന്ന കല്ല്യാണ ഹാളുകൾ, ഹോട്ടലുകൾ എന്നിവയെ രജിസ്റ്റർ ചെയ്ത സർക്കാരിന്റെ അംഗീകാരമുള്ള എൻ.ജി.ഓ-കളുമായി ബന്ധിപ്പിക്കുന്ന മികച്ച പ്ലാറ്റ്ഫോമാണ് ഫുഡ്ബ്രിഡ്ജ്. ഇതിലൂടെ സുരക്ഷിതമായ ഭക്ഷണവിതരണവും പരിസ്ഥിതി സംരക്ഷണവും നമ്മൾ ഒരുമിച്ച് ഉറപ്പ് വരുത്തുന്നു.",
    about_mission_title: "വിശപ്പുരഹിത നാളെ",
    about_mission_desc: "ഭക്ഷണം പാഴാക്കാതെ ഓരോ നേരത്തെ ജീവനും പോഷിപ്പിക്കുക എന്നതാണ് ഞങ്ങളുടെ മുഖ്യലക്ഷ്യം. പാവപ്പെട്ട കുടുംബങ്ങളെ ഞങ്ങൾ ഇതിലൂടെ പിന്തുണക്കുന്നു.",
    about_val1_title: "ഉയർന്ന സുരക്ഷിതത്വം",
    about_val1_desc: "ഭക്ഷണത്തിന്റെ ഗുണനിലവാരവും താപനിലയും കൃത്യമായി പരിശോധിച്ചു മാത്രം വിതരണം ചെയ്യപ്പെടുന്നു.",
    about_val2_title: "അതിവേഗ മുന്നറിയിപ്പുകൾ",
    about_val2_desc: "ഏറ്റവും അടുത്തുള്ള സന്നദ്ധ പ്രവർത്തകർക്ക് മിനിറ്റുകൾക്കുള്ളിൽ വിതരണ സന്ദേശം ലഭ്യമാക്കുന്ന സാങ്കേതിക വിദ്യ.",
    about_val3_title: "ഹരിത പരിസ്ഥിതി സഹായം",
    about_val3_desc: "നിങ്ങൾ നൽകുന്ന ഓരോ ഭക്ഷണപ്പൊതിയും കാർബൺ കൈമുദ്ര കുറക്കുന്നതിൽ സഹായിക്കുന്നു."
  }
};

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1500;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = Math.ceil(end / steps);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, intervalTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

interface HomePageProps {
  currentLang: AppLanguage;
  setActivePage: (page: any) => void;
  activeSection?: string;
  stats: {
    donations: number;
    foodSaved: number;
    ngosConnected: number;
    peopleServed: number;
  };
}

export default function HomePage({ currentLang, setActivePage, activeSection, stats }: HomePageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const local_t = LOCAL_TRANSLATIONS[currentLang] || LOCAL_TRANSLATIONS.en;

  // React useEffect for scrolling
  useEffect(() => {
    if (activeSection && activeSection !== 'home') {
      const element = document.getElementById(activeSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (activeSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);
  
  // Local state for Contact Form
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4500);
  };

  const partners = [
    { name: 'Feeding India', logo: 'https://images.unsplash.com/photo-1599305445671-ac2c68bab36c?w=150' },
    { name: 'Akshaya Patra', logo: 'https://images.unsplash.com/photo-1599305445671-ac2c68bab36c?w=150' },
    { name: 'Robin Hood Army', logo: 'https://images.unsplash.com/photo-1599305445671-ac2c68bab36c?w=150' },
    { name: 'Rise Against Hunger', logo: 'https://images.unsplash.com/photo-1599305445671-ac2c68bab36c?w=150' },
    { name: 'No Food Waste', logo: 'https://images.unsplash.com/photo-1599305445671-ac2c68bab36c?w=150' }
  ];

  return (
    <div className="relative z-10 w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-8 pb-16 bg-radial-gradient from-emerald-50/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Award-winning National Initiative</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
                {t.hero_headline.split(',')[0]},
                <span className="block mt-2.5 text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-600 to-green-500 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  {t.hero_headline.split(',')[1] || ' Feed More Lives'}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                {t.hero_desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={() => setActivePage('login')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl shadow-lg shadow-emerald-500/25 dark:shadow-emerald-950/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>{t.btn_donate_food}</span>
                </button>
                <button
                  onClick={() => setActivePage('map')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{t.btn_find_donations}</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-900">
                <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-3">Government Regulatory Trust</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 font-semibold font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> FSSAI COMPLIANT</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-blue-500" /> SUPABASE PERSISTED</span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> NGO CO-OPERATIVE</span>
                </div>
              </div>
            </motion.div>
            
            {/* Hero Right: Overlapping Animated Image Collage & Flow badge panels */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:pl-6 w-full flex flex-col gap-8 items-center"
            >

              {/* Operations step flow */}
              <div className="relative w-full max-w-[480px] glass p-6 sm:p-8 rounded-3xl border border-emerald-500/25 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 group hover:shadow-emerald-500/15 hover:scale-[1.01] transition-all duration-300">
                <div className="absolute top-0 right-0 -tr-10 bg-gradient-to-br from-emerald-500/10 to-transparent w-36 h-36 rounded-bl-full pointer-events-none"></div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Heart className="w-6 h-6 fill-current animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>How FoodBridge Operates</span>
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Empowering real-time, zero-waste nourishment channels</p>
                  </div>
                </div>

                {/* Steps Flow */}
                <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500/30 before:via-blue-500/20 before:to-transparent">
                  
                  {/* Step 1 */}
                  <div className="relative pl-12 group/step">
                    <div className="absolute left-3 top-0.5 w-[26px] h-[26px] -translate-x-1/2 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[11px] font-bold shadow-lg shadow-emerald-500/30">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover/step:text-emerald-600 dark:group-hover/step:text-emerald-400 transition-colors">
                      Excess Food Logged Quickly
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Hotels, catering organizers, and restaurants input active quantities and safe pickup timelines.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative pl-12 group/step">
                    <div className="absolute left-3 top-0.5 w-[26px] h-[26px] -translate-x-1/2 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold shadow-lg shadow-blue-500/30">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover/step:text-blue-500 transition-colors">
                      Instant Smart Match Dispatched
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Proximity-based algorithms alert verified local NGOs and volunteer kitchens within the golden hour.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative pl-12 group/step">
                    <div className="absolute left-3 top-0.5 w-[26px] h-[26px] -translate-x-1/2 rounded-full bg-amber-500 flex items-center justify-center text-white text-[11px] font-bold shadow-lg shadow-amber-500/30">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover/step:text-amber-500 transition-colors">
                      Safe Hot Meals Distributed
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Nourishment is collected, validated under regulatory guidelines, and served to children and families in need.
                    </p>
                  </div>

                </div>

                {/* Bottom Trust Row */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    DIRECT MUTUAL PIPELINE ACTIVE
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    FSSAI Safe
                  </span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" id="statistics-grid">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="space-y-2 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                <Counter value={stats.donations} />
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {t.stat_donations}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="space-y-2 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">
                <Counter value={stats.foodSaved} />
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {t.stat_food_saved}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.18 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="space-y-2 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl font-black text-amber-500 dark:text-amber-400 font-mono">
                <Counter value={stats.ngosConnected} />
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {t.stat_ngos_connected}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.24 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="space-y-2 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl font-black text-rose-500 dark:text-rose-400 font-mono">
                <Counter value={stats.peopleServed} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {t.stat_people_served}
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-20 bg-transparent" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.features_title}
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base font-light">
              {t.features_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 fill-emerald-500/25" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feat_donate_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.feat_donate_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feat_request_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.feat_request_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feat_tracking_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.feat_tracking_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 100 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feat_map_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.feat_map_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 100 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feat_sustainability_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.feat_sustainability_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feat_collaboration_title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.feat_collaboration_desc}</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3.5 ABOUT SECTION */}
      <section className="py-24 bg-gradient-to-b from-stone-50/10 via-emerald-500/5 to-transparent border-t border-slate-100 dark:border-slate-900" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in duration-500">
            <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold font-mono">Our Core Philanthropy</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {local_t.about_title}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm sm:text-base font-light leading-relaxed">
              {local_t.about_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story & Description Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="glass p-8 sm:p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  <span>{local_t.about_card_title}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light mb-6">
                  {local_t.about_card_body}
                </p>
                
                <div className="p-4.5 bg-emerald-500/10 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-400 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">National Safety Code Compliant:</span> FoodBridge strictly operates under statutory hygiene frameworks. Every listed surplus meal is validated along strict temperature and storage timeline gates.
                  </div>
                </div>
              </div>

              {/* Mission Statement Callout */}
              <div className="p-6 bg-slate-50/60 dark:bg-slate-950/40 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-900 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{local_t.about_mission_title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                    {local_t.about_mission_desc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Core Values Pillar Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-6 space-y-6"
            >
              
              <div className="p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:shadow-xl hover:-translate-y-0.5 transition-all flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{local_t.about_val1_title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{local_t.about_val1_desc}</p>
                </div>
              </div>

              <div className="p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:shadow-xl hover:-translate-y-0.5 transition-all flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{local_t.about_val2_title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{local_t.about_val2_desc}</p>
                </div>
              </div>

              <div className="p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:shadow-xl hover:-translate-y-0.5 transition-all flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{local_t.about_val3_title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{local_t.about_val3_desc}</p>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold font-mono">Our Operational Cycle</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              {t.how_it_works}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm font-light">
              {t.how_it_works_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 90 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/40 relative hover:shadow-lg transition-all"
            >
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-300 dark:text-slate-700">01</div>
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold mb-5 shadow-inner">
                🥗
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{t.step1_title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.step1_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 90 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/40 relative hover:shadow-lg transition-all"
            >
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-300 dark:text-slate-700">02</div>
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center text-2xl font-bold mb-5 shadow-inner">
                🛡️
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{t.step2_title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.step2_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 90 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/40 relative hover:shadow-lg transition-all"
            >
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-300 dark:text-slate-700">03</div>
              <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center text-2xl font-bold mb-5 shadow-inner">
                🚚
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{t.step3_title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.step3_desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 90 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/40 relative hover:shadow-lg transition-all"
            >
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-300 dark:text-slate-700">04</div>
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center text-2xl font-bold mb-5 shadow-inner">
                ❤️
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{t.step4_title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{t.step4_desc}</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.testimonials_title}
            </h2>
            <p className="mt-3 text-slate-400 dark:text-slate-500 font-light text-sm">
              Read how FoodBridge is redefining community nutrition in municipal hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-12 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between">
              <p className="text-sm sm:text-base italic text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                "{t.test1_quote}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.test1_author.split(',')[0]}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{t.test1_author.split(',')[1] || 'Restowner'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between">
              <p className="text-sm sm:text-base italic text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                "{t.test2_quote}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                  AH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.test2_author.split(',')[0]}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{t.test2_author.split(',')[1] || 'Hope Wellness NGO'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. IMPACT TRACKER INFO CARD */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl max-w-7xl mx-auto rounded-3xl my-6 relative overflow-hidden" id="impact">
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent mix-blend-overlay"></div>
        <div className="relative z-10 px-6 sm:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] bg-white/20 text-white font-black px-3 py-1 rounded-full uppercase tracking-wider">Ecological Balance</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 leading-tight">
                Combating Global Warming via Food Recovery
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-emerald-100 leading-relaxed font-light">
                Methane released from organic municipal waste represents 10% of total international emissions. By placing listing portals for hotels to share meals instantly, we neutralize landfill hazards before they rot. Every plate saved is a vote for municipal resilience and planetary wellness.
              </p>
              
              {/* Environmental footprint indexes */}
              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-emerald-500/30">
                <div>
                  <p className="text-2xl sm:text-3xl font-black font-mono">{(stats.foodSaved * 2.5).toFixed(1)}</p>
                  <p className="text-[10px] text-emerald-200">CO₂ Reductions (kg)</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black font-mono">{(stats.foodSaved * 0.12).toFixed(1)}</p>
                  <p className="text-[10px] text-emerald-200">Municipal Litres Saved</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black font-mono">{(stats.foodSaved / 35).toFixed(0)}</p>
                  <p className="text-[10px] text-emerald-200">Landfill Loads Diverted</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 text-center space-y-4">
              <Leaf className="w-12 h-12 text-green-300 mx-auto animate-bounce" />
              <span className="block text-xs uppercase tracking-widest font-mono font-bold text-green-200">Verified ESG Equivalent</span>
              <h3 className="text-lg font-bold">Your Donations Plant Virtual Trees</h3>
              <p className="text-xs text-emerald-100 font-light max-w-sm mx-auto">
                Roughly every 50 kg of raw or processed meals rescued offsets the equivalent of planting two standard forest saplings. Connect, donate, and watch our collective forest grow.
              </p>
              <div className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-emerald-900/30 text-xs font-bold border border-green-300/10">
                <CheckCircle className="w-4 h-4 text-emerald-300" /> Currently Native Cleared
              </div>
            </div>
          </div>

          {/* Extended Nutritional & Social Impact Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-white/10 relative z-10">
            <div className="p-5.5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-emerald-300 text-xl">🥦</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-300">Nutritional Diversity</h4>
              <p className="text-xs text-emerald-100 font-light leading-relaxed">
                We don't just route calorie-heavy surplus. Over 35% of recovered food streams are fresh vegetables, grains, and organic fruits, directly addressing vitamins & trace nutrient deficits in local shelters.
              </p>
            </div>
            <div className="p-5.5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-emerald-300 text-xl">📈</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-300">Vendor Waste Reductions</h4>
              <p className="text-xs text-emerald-100 font-light leading-relaxed">
                Partner restaurants report up to 18% savings on local commercial waste disposal tariffs. Donors qualify for community ESG certificates and corporate social recognition.
              </p>
            </div>
            <div className="p-5.5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-emerald-300 text-xl">🤝</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-300">Zero-Overhead Sourcing</h4>
              <p className="text-xs text-emerald-100 font-light leading-relaxed">
                By cutting third-party transport middlemen through intelligent proximity alerts, local NGOs claim and claim premium freshly cooked meals at zero procurement expense.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. NGO PARTNERS BRAND SLIDER */}
      <section className="py-14 bg-slate-50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-6">Our Recognized NGO Network Alliance</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-65 dark:opacity-55 grayscale hover:grayscale-0 transition-all duration-300">
            {partners.map((p, idx) => (
              <span key={idx} className="font-sans font-bold text-sm tracking-wider text-slate-600 dark:text-slate-300">{p.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT SECTION */}
      <section className="py-20 bg-transparent border-t border-slate-100 dark:border-slate-900" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Info content */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold font-mono">How can we help?</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {t.contact_title}
                </h2>
                <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed">
                  {t.contact_subtitle}
                </p>
              </div>

              <div className="space-y-4 pt-4 text-sm text-slate-600 dark:text-slate-300 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-emerald-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Emergency Logistics helpline</h5>
                    <p className="font-bold">+91 98765-43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-emerald-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Administrative Desk Address</h5>
                    <p className="font-bold">support@foodbridge.gov.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/30">
              {isSent ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-xl text-center space-y-3 animate-in zoom-in-95">
                  <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 animate-bounce" />
                  <h4 className="text-sm font-bold">Message Lodged Successfully!</h4>
                  <p className="text-xs">Your priority reference token has been saved in our control loop database. A support officer will coordinate within 15 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.placeholder_name}</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name} 
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g., Prof. Anand Murthy" 
                        className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.placeholder_email}</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email} 
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="anand@univer.edu" 
                        className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.placeholder_subject}</label>
                    <input 
                      type="text" 
                      value={contactForm.subject} 
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g., Bulk donation pickup coordinate" 
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.placeholder_message}</label>
                    <textarea 
                      rows={4}
                      required
                      value={contactForm.message} 
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={t.placeholder_message} 
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.btn_send}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
