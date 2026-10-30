import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Sprout,
  AlertTriangle,
  Landmark,
  RotateCcw,
} from 'lucide-react';

const suggestedPrompts = [
  { text: 'Which crops are best suited for Belagavi Kharif season?', icon: Sprout },
  { text: 'How do I identify and manage Tomato Early Blight?', icon: AlertTriangle },
  { text: 'What is the optimal NPK fertilizer schedule for Paddy?', icon: Sparkles },
  { text: 'How can I apply for the PMKSY Drip Irrigation subsidy?', icon: Landmark },
];

const initialMessages = [
  {
    id: 1,
    sender: 'bot',
    text: 'Namaskara! I am your AgriSphere Agriculture Assistant. Ask me anything about crop suitability, disease symptoms, weather guidelines, fertilizer dosage, or government farming schemes in Karnataka.',
    time: 'Just now',
  },
];

const knowledgeBase = [
  {
    keywords: ['belagavi', 'crop', 'kharif', 'suitable', 'season'],
    reply: "Based on Belagavi district's black clayey loam and red sandy soils with average 26°C monsoon temperatures, the top recommended crops are:\n1. Maize (Hybrid 900M, CP-818) – high drought resilience and reliable APMC market demand\n2. Tomato (S-22, Shivam) – high profitability in well-drained loamy soils\n3. Paddy / Rice (Jaya, Sona Masoori) – ideal for assured irrigation areas like Khanapur\n4. Groundnut & Soybean – excellent for nitrogen fixation and soil health.",
  },
  {
    keywords: ['blight', 'tomato', 'disease', 'fungus'],
    reply: 'Tomato Early Blight (Alternaria solani) causes target-board concentric brown rings on older lower leaves.\nManagement steps:\n• Spray Mancozeb 75% WP @ 2g/L or copper oxychloride @ 2.5g/L at initial symptom stage.\n• For organic treatment, spray Neem oil 5ml/L.\n• Maintain proper staking and avoid overhead flood irrigation.',
  },
  {
    keywords: ['fertilizer', 'npk', 'paddy', 'rice', 'urea'],
    reply: 'Recommended NPK dosage for Paddy in Karnataka:\n• Standard RDF: 100 kg Nitrogen, 50 kg P2O5, 50 kg K2O per hectare.\n• Basal at transplanting: 50% N + 100% P + 50% K.\n• Top dressing at tillering (30 days): 25% N.\n• Top dressing at panicle initiation: 25% N + 50% K.\nApply Zinc Sulphate @ 20 kg/ha in deficient soils.',
  },
  {
    keywords: ['scheme', 'drip', 'subsidy', 'pmksy', 'irrigation'],
    reply: 'Under the Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) – Per Drop More Crop:\n• Small & Marginal Farmers in Karnataka receive up to 90% subsidy for micro-drip units.\n• General category farmers receive up to 75% subsidy.\n• Required documents: RTC/Pahani, Aadhaar card, bank passbook, and water source certificate.\n• Apply online at raitamitra.karnataka.gov.in or visit your nearest Raitha Samparka Kendra (RSK).',
  },
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend = inputMessage) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      const match = knowledgeBase.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      const replyText = match
        ? match.reply
        : `Thank you for your question about "${text}". For Belagavi regional soil and weather conditions, we recommend reviewing your specific soil test report and consulting the nearest Raitha Samparka Kendra or KVK Belagavi for certified local advice.`;

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Farming Decision Assistant</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">AI Chatbot</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Ask questions about crop suitability, pest remedies, weather advisories, fertilizer dosages, or Karnataka government schemes.
          </p>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestedPrompts.map((prompt, idx) => {
          const Icon = prompt.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(prompt.text)}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-[#15803D] text-left transition-colors text-xs font-medium text-[#1F2937]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="line-clamp-1">{prompt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[480px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-[#15803D] text-white rounded-tr-none'
                    : 'bg-[#F8FAF6] border border-slate-200 text-[#1F2937] rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#F8FAF6] border border-slate-200 rounded-xl rounded-tl-none p-3 text-xs text-[#64748B] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse delay-200" />
                <span className="ml-1 text-[11px]">Assistant is preparing advice...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-slate-200 p-3 sm:p-4 bg-[#F8FAF6]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your question about crops, fertilizers, pests, or subsidies..."
              className="flex-1 bg-white border border-slate-200 focus:border-[#15803D] rounded-lg px-3.5 py-2 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#14532D] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
