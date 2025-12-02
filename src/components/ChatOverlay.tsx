import React, { useState, useEffect, useRef } from "react";

// Component to render message text with hyperlinked URLs
// If `isAssistant` is true, also render a preview for each URL
const MessageContent = ({ content, isAssistant }: { content: string; isAssistant: boolean }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  return (
    <div className="flex flex-col">
      <p className={`font-medium leading-[1.7] not-italic relative text-[15px] ${isAssistant ? 'text-black' : 'text-white'} tracking-[0.45px]`}>
        {parts.map((part, idx) => {
          if (urlRegex.test(part)) {
            return (
              <React.Fragment key={idx}>
                <a href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                  {part}
                </a>
                {isAssistant && <LinkPreview url={part} />}
              </React.Fragment>
            );
          }
          return <React.Fragment key={idx}>{part}</React.Fragment>;
        })}
      </p>
    </div>
  );
};

// Utility component to fetch and display link preview
const LinkPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState<{ title?: string; description?: string; image?: string }>({});
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const fetchPreview = async () => {
      try {
        const response = await fetch(url, { mode: "cors" });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const title = doc.querySelector('title')?.textContent?.trim();
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim();
        if (!cancelled) {
          setPreview({ title, description, image });
        }
      } catch (e) {
        console.error('Failed to fetch link preview', e);
        if (!cancelled) setError(true);
      }
    };
    fetchPreview();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (error) return null;
  return (
    <div className="mt-2 border rounded-md p-2 max-w-full overflow-hidden bg-gray-50">
      {preview.image && (
        <img src={preview.image} alt="preview" className="w-full h-32 object-cover mb-2 rounded" />
      )}
      {preview.title && <div className="font-medium text-sm mb-1">{preview.title}</div>}
      {preview.description && <div className="text-xs text-gray-600">{preview.description}</div>}
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs block mt-1">
        {url}
      </a>
    </div>
  );
};
import svgPaths from "../imports/svg-pthj2k27za";
import imgProfile from "figma:asset/6f425ab7a2319fc065c66c69e67abde5cdbaf375.png";
import { getElevenLabsService, Message } from "../services/elevenlabs";

function ArrowUp() {
  return (
    <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Arrow up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Arrow up">
          <path d={svgPaths.p2b9ec400} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p2edaeb50} fill="var(--fill-0, black)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function SuggestionPill({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:bg-gray-50 transition-colors box-border flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 border-none cursor-pointer"
    >
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.07)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_4px_32px_0px_rgba(0,0,0,0.08)]" />
      <span className="font-medium leading-[1.7] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-right tracking-[0.42px] whitespace-pre">
        {text}
      </span>
    </button>
  );
}

export function ChatOverlay({ isOpen, onClose, initialMessage }: { isOpen: boolean; onClose: () => void; initialMessage?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const elevenLabsService = useRef(getElevenLabsService());

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const [partialMessage, setPartialMessage] = useState("");

  const thinkingStartTimeRef = useRef<number>(0);

  // Setup ElevenLabs service listeners
  useEffect(() => {
    const service = elevenLabsService.current;

    service.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
      if (message.role === 'assistant') {
        let startTime = thinkingStartTimeRef.current;
        if (startTime === 0) {
          startTime = Date.now();
        }
        const elapsed = Date.now() - startTime;
        const minDuration = 3000; // Minimum 3 seconds
        const remaining = minDuration - elapsed;

        if (remaining > 0) {
          setTimeout(() => {
            setIsThinking(false);
            setPartialMessage(""); // clear any partial
          }, remaining);
        } else {
          setIsThinking(false);
          setPartialMessage(""); // clear any partial
        }
      }
    });

    service.onPartialMessage((content) => {
      setPartialMessage(content);
    });

    service.onStatus((status) => {
      setConnectionStatus(status);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Handle initial message when chat opens
  useEffect(() => {
    if (isOpen && initialMessage && initialMessage.trim()) {
      setIsThinking(true);
      thinkingStartTimeRef.current = Date.now();
      elevenLabsService.current.sendMessage(initialMessage);
    }
  }, [isOpen, initialMessage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setIsThinking(true);
    thinkingStartTimeRef.current = Date.now();
    elevenLabsService.current.sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    // setInputValue(text); // No need to set input value if sending immediately
    setIsThinking(true);
    thinkingStartTimeRef.current = Date.now();
    elevenLabsService.current.sendMessage(text);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] pointer-events-none overflow-hidden`}>
      {/* Backdrop - click to close */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-in Panel (Window Style) */}
      <div
        className={`
          absolute right-[32px] bottom-[32px] top-[32px] w-[30%] min-w-[360px] max-w-[600px]
          bg-white rounded-none shadow-2xl flex flex-col overflow-y-auto pointer-events-auto
          transform transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1)
          ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
        `}
      >
        <div className="size-full flex flex-col overflow-y-auto">
          {/* Header / Main Content Container */}
          <div className="box-border flex-1 flex flex-col items-start justify-between p-[32px] relative size-full overflow-y-auto w-full">

            {/* Top Section: Header & Chat History */}
            <div className="flex flex-col gap-[24px] items-start relative flex-1 min-h-0 w-full">

              {/* Header */}
              <div className="flex items-center justify-between relative shrink-0 w-full">
                <div className="flex gap-[13px] items-center relative shrink-0">
                  <div className="relative rounded-[99px] shrink-0 size-[40px]" data-name="1725289156788 1">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[99px] size-full" src={imgProfile} />
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0">
                    <p className="mb-0 font-uber font-bold leading-[1.1] text-[16px] text-black">Aaron</p>
                    <p className="mb-0 font-medium text-[14px] text-black/60 leading-[1.4]">Senior Product Designer</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="overflow-clip relative rounded-[9999px] shrink-0 size-[32px] hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent p-0"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Chat History - Scrollable */}
              <div className="flex-1 overflow-y-auto w-full pr-2">
                <div className="flex flex-col gap-[20px] items-start relative w-full">
                  {messages.length === 0 && (
                    <div className="text-center w-full py-8 text-black/40">
                      <p>Start a conversation with Aaron!</p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col gap-[10px] ${message.role === 'user' ? 'items-end' : 'items-start'} justify-center relative shrink-0 w-full animate-slide-in`}
                    >
                      {message.role === 'user' ? (
                        <div className="bg-black box-border flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[32px] shrink-0 max-w-[80%]">
                          <MessageContent content={message.content} isAssistant={false} />
                        </div>
                      ) : (
                        <div className="flex gap-[10px] items-center relative shrink-0 w-full flex-col">
                          <MessageContent content={message.content} isAssistant={true} />

                        </div>
                      )}
                    </div>
                  ))}

                  {partialMessage && (
                    <div className="flex gap-[10px] items-center relative shrink-0 w-full flex-col animate-slide-in">
                      <MessageContent content={partialMessage} isAssistant={true} />
                    </div>
                  )}

                  {isThinking && (
                    <div className="flex gap-[10px] items-center relative shrink-0 w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[14px] text-black/50">Thinking...</span>
                        <div className="h-[14px] w-[120px] rounded-[4px] bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Bottom Section: Input & Suggestions */}
            <div className="relative shrink-0 w-full mt-4">
              <div className="box-border flex flex-col gap-[16px] items-start relative w-full">

                {/* Input Area */}
                <div className="bg-white flex flex-col items-start relative rounded-[32px] shrink-0 w-full shadow-sm">
                  <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_4px_32px_0px_rgba(0,0,0,0.08)]" />

                  {/* Text Input Wrapper */}
                  <div className="relative shrink-0 w-full">
                    <div className="flex flex-row items-center size-full">
                      <div className="box-border flex gap-[10px] items-center px-[24px] py-[16px] relative w-full">
                        <textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Ask me anything"
                          className="font-medium leading-[1.7] w-full resize-none outline-none border-none bg-transparent p-0 text-[15px] text-black placeholder:text-[rgba(0,0,0,0.7)] tracking-[0.45px] min-h-[24px] max-h-[120px]"
                          rows={1}
                          style={{ fieldSizing: 'content' } as any}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Send Button Wrapper */}
                  <div className="relative shrink-0 w-full">
                    <div className="flex flex-row items-center justify-end size-full">
                      <div className="box-border flex gap-[10px] items-center justify-end p-[16px] relative w-full pt-0">
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim()}
                          className="bg-black overflow-clip relative rounded-[9999px] shrink-0 size-[32px] flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer border-none p-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ArrowUp />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-[7px] items-center relative shrink-0 w-full">
                    <SuggestionPill
                      text="What is your design philosophy?"
                      onClick={() => handleSuggestionClick("What is your design philosophy?")}
                    />
                    <SuggestionPill
                      text="What motivates you at work?"
                      onClick={() => handleSuggestionClick("What motivates you at work?")}
                    />
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}