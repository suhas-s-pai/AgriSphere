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
} from 'lucide-react';

const faqs = [
  {
    q: 'How are the crop suitability recommendations calculated?',
    a: 'Recommendations are based on your selected taluk (e.g. Belagavi, Gokak), predominant soil type (Black, Red Loamy, Alluvial), current season (Kharif, Rabi, Summer), and water availability according to UAS Dharwad agronomic data.',
  },
  {
    q: 'Where do the APMC market prices come from?',
    a: 'Market prices reflect official daily modal and range rates published by the Karnataka State Agricultural Marketing Board (KSAMB) for major APMC yards in Belagavi district.',
  },
  {
    q: 'How can I apply for the PMKSY Drip Irrigation Subsidy?',
    a: 'Small and marginal farmers in Karnataka can receive up to 90% subsidy for drip irrigation. Check the Government Schemes module for step-by-step documentation, or visit your local Raitha Samparka Kendra.',
  },
  {
    q: 'How do I add or adjust my farm plot on the map?',
    a: 'Go to the "My Farm" page from the left sidebar, click "Adjust Farm Pin on Map", and simply click on your land coordinates to save the marker.',
  },
];

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [queryText, setQueryText] = useState('');

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
            Official farmer helplines, platform user guides, frequently asked questions, and direct support assistance.
          </p>
        </div>
      </div>

      {/* Kisan Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Kisan Call Centre (KCC)</h3>
            <p className="text-xs text-[#64748B] mt-1">Toll-free national farmer helpline available in Kannada and English.</p>
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

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Belagavi Agri Helpdesk</h3>
            <p className="text-xs text-[#64748B] mt-1">Joint Director of Agriculture Office, Belagavi district extension desk.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="tel:08312407215"
              className="text-base font-extrabold text-[#15803D] hover:underline"
            >
              0831-2407215
            </a>
            <span className="text-[10px] text-slate-400 block mt-0.5">Mon – Fri: 10 AM – 5:30 PM</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Email Assistance</h3>
            <p className="text-xs text-[#64748B] mt-1">Submit feedback, report app issues, or ask agronomy questions.</p>
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
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Query Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-[#14532D] mb-1">Send a Message to Support</h2>
        <p className="text-xs text-[#64748B] mb-4">Have an issue or suggestion? Send us a note.</p>

        {submitted ? (
          <div className="p-4 rounded-lg bg-[#DCFCE7] border border-emerald-200 text-xs text-[#14532D] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>Thank you, Ramesh Patil. Your message has been received by our Belagavi support team.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <textarea
              rows="3"
              required
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Describe your question or difficulty..."
              className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] p-3 text-xs text-[#1F2937] outline-none focus:border-[#15803D]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#15803D] text-white font-semibold hover:bg-[#14532D] transition-colors"
            >
              Submit Support Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
