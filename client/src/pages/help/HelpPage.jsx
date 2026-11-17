import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Navigation,
  Globe,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';

const faqs = [
  {
    q: 'How are the crop suitability recommendations calculated?',
    a: 'Recommendations are dynamically derived from your verified agro-climatic region, predominant regional soil type (Black, Red Loamy, Sandy Loam, Clay), active season (Kharif, Rabi, Summer), and water availability according to ICAR and State Agricultural University agronomic packages of practices.',
  },
  {
    q: 'Where do the APMC market prices come from?',
    a: 'Market prices reflect official daily modal, minimum, and maximum rates from the Agmarknet agricultural marketing portal and Karnataka State Agricultural Marketing Board (KSAMB) APMC market yards.',
  },
  {
    q: 'How does AgriSphere detect my live location?',
    a: 'AgriSphere requests high-accuracy browser GPS coordinates with your consent and runs reverse geocoding via OpenStreetMap Nominatim. If location permission is withheld, you can manually choose any regional agricultural hub from the top header.',
  },
  {
    q: 'How do I add or adjust my farm plot on the map?',
    a: 'Navigate to "My Farm" from the sidebar. Click "Adjust Farm Pin on Map" and select your land boundary coordinates to persist your plot survey numbers, area, and crop records.',
  },
];

const HelpPage = () => {
  const {
    city,
    district,
    state,
    formattedName,
    isGps,
    isGlobal,
  } = useLocationContext();

  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [queryText, setQueryText] = useState('');

  const districtName = district || city || 'Regional';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    setSubmitted(true);
    setQueryText('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kisan Support & Helpdesk</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Help & Support</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Official farmer helplines, platform user guides, and direct support assistance for{' '}
            <span className="font-semibold text-slate-800">{formattedName}</span>.
          </p>
        </div>

        {/* Location Badge */}
        <div className="flex items-center gap-1.5 bg-[#F8FAF6] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#1F2937] shrink-0 self-start sm:self-auto">
          {isGps ? (
            <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
          ) : isGlobal ? (
            <Globe className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
          )}
          <span className="font-semibold truncate max-w-[160px]">{formattedName}</span>
        </div>
      </div>

      {/* Kisan Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Kisan Call Centre (KCC)</h3>
            <p className="text-xs text-[#64748B] mt-1">
              National toll-free agricultural helpline answering farmer queries in 22 regional languages.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="tel:18001801551"
              className="text-base font-extrabold text-[#15803D] hover:underline"
            >
              1800-180-1551
            </a>
            <span className="text-[10px] text-slate-400 block mt-0.5">06:00 AM – 10:00 PM Daily</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">{districtName} Agri Helpdesk</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Joint Director of Agriculture Office & District Agriculture Extension Counter.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="tel:08312407215"
              className="text-base font-extrabold text-[#15803D] hover:underline"
            >
              0831-2407215 / 1800-425-3553
            </a>
            <span className="text-[10px] text-slate-400 block mt-0.5">Mon – Fri: 10 AM – 5:30 PM</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Email Assistance</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Submit agronomy questions, report app bugs, or suggest local market mandis.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="mailto:support@agrisphere.in"
              className="text-sm font-bold text-[#15803D] hover:underline"
            >
              support@agrisphere.in
            </a>
            <span className="text-[10px] text-slate-400 block mt-0.5">Response within 24 hours</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#14532D]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Quick answers to common farming and platform questions.</p>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1F2937] hover:text-[#15803D] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-[#64748B] leading-relaxed mt-2 pt-1 border-t border-slate-50">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Query Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h2 className="text-base font-bold text-[#14532D]">Submit an Agronomic or Technical Query</h2>
        <p className="text-xs text-[#64748B]">
          Have a question about fertilizer scheduling, local mandi arrivals, or scheme enrollment? Send your question to our field agronomists.
        </p>

        {submitted ? (
          <div className="p-4 rounded-lg bg-[#DCFCE7] border border-emerald-200 flex items-center gap-2.5 text-xs text-[#14532D]">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            <span className="font-semibold">
              Thank you! Your query has been recorded. Our extension team will review it.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              rows="3"
              required
              placeholder="Type your question here (e.g. Recommended seed rate for Rabi maize in black soil)..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] p-3 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-bold hover:bg-[#14532D] transition-colors shadow-xs"
              >
                Send Question
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
