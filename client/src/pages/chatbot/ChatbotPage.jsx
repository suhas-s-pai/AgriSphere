import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ExternalLink, RefreshCw, Bot, AlertCircle, Navigation, MapPin, Globe, AlertTriangle } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';

const CHATBOT_URL = 'https://agrisphere-chatbot.onrender.com/';

const ChatbotPage = () => {
  const {
    source,
    latitude,
    longitude,
    city,
    district,
    state,
    country,
    formattedName,
    isGps,
    isManual,
    isGlobal,
    permissionStatus,
  } = useLocationContext();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef(null);

  // Construct location-aware query params to pass to the deployed chatbot
  const targetChatbotUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (isGps && latitude != null && longitude != null) {
      params.set('source', 'gps');
      params.set('lat', latitude.toString());
      params.set('lng', longitude.toString());
      if (city) params.set('city', city);
      if (district) params.set('district', district);
      if (state) params.set('state', state);
      if (country) params.set('country', country);
      params.set('locationName', formattedName);
    } else if (isManual && formattedName) {
      params.set('source', 'manual');
      if (latitude != null && longitude != null) {
        params.set('lat', latitude.toString());
        params.set('lng', longitude.toString());
      }
      if (city) params.set('city', city);
      if (district) params.set('district', district);
      if (state) params.set('state', state);
      if (country) params.set('country', country);
      params.set('locationName', formattedName);
    } else if (isGlobal) {
      params.set('source', 'global');
      params.set('locationName', 'Global Mode');
    }
    const queryString = params.toString();
    return queryString ? `${CHATBOT_URL}?${queryString}` : CHATBOT_URL;
  }, [isGps, isManual, isGlobal, latitude, longitude, city, district, state, country, formattedName]);

  // Synchronize location update via postMessage to iframe
  const sendLocationSyncMessage = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'AGRISPHERE_LOCATION_SYNC',
          payload: {
            source,
            latitude: isGps || isManual ? latitude : null,
            longitude: isGps || isManual ? longitude : null,
            city,
            district,
            state,
            country,
            formattedName,
            isGlobal,
            permissionStatus,
          },
        },
        '*'
      );
    }
  }, [source, latitude, longitude, city, district, state, country, formattedName, isGlobal, permissionStatus, isGps, isManual]);

  useEffect(() => {
    sendLocationSyncMessage();
  }, [sendLocationSyncMessage]);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey((prev) => prev + 1);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    sendLocationSyncMessage();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-3">
      {/* Utility Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant Online</span>
          </div>

          {/* Centralized Location Context Indicator for Chatbot */}
          <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700">
            {isGps ? (
              <>
                <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
                <span className="font-semibold text-[#14532D]">GPS Context:</span>
                <span className="truncate max-w-[180px] sm:max-w-none">{formattedName}</span>
              </>
            ) : isManual ? (
              <>
                <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                <span className="font-semibold text-[#14532D]">Location:</span>
                <span className="truncate max-w-[180px] sm:max-w-none">{formattedName}</span>
              </>
            ) : isGlobal ? (
              <>
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-700">Global Context (All Regions)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-800">Location Denied (General Mode)</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleRefresh}
            title="Reload Assistant"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#15803D] text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href={targetChatbotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#15803D] text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded ChatBot Frame Container */}
      <div className="relative w-full h-[720px] sm:h-[760px] lg:h-[800px] xl:h-[840px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F8FAF6] p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-4 shadow-xs">
              <Bot className="w-6 h-6 animate-bounce" />
            </div>
            <h2 className="text-base font-bold text-[#14532D]">Connecting to AgriSphere AI Chatbot</h2>
            <p className="text-xs text-[#64748B] max-w-sm mt-1">
              Sharing verified location context ({formattedName}) with your agricultural assistant...
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#15803D]">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
              <span>Establishing secure connection</span>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Unable to Display Embedded Chatbot</h2>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-5">
              The external chatbot service could not be loaded inside the iframe. You can open and use the full AgriSphere Chatbot directly in a new tab.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <a
                href={targetChatbotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Open AgriSphere ChatBot</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={targetChatbotUrl}
            title="AgriSphere AI Agriculture Chatbot"
            onLoad={handleIframeLoad}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="w-full h-full border-0 rounded-2xl"
            allow="microphone; camera; clipboard-write; clipboard-read"
          />
        )}
      </div>
    </div>
  );
};

export default ChatbotPage;
