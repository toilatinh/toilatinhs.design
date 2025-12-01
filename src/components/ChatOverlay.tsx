import React, { useState, useEffect, useRef } from "react";
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
      className="bg-white hover:bg-gray-50 transition-colors box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 border-none cursor-pointer"
    >
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.07)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_4px_32px_0px_rgba(0,0,0,0.08)]" />
      <span className="font-uber font-medium leading-[1.7] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-right tracking-[0.42px] whitespace-pre">
        {text}
      </span>
    </button>
  );
}

export function ChatOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  // Setup ElevenLabs service listeners
  useEffect(() => {
    const service = elevenLabsService.current;

    service.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
      if (message.role === 'assistant') {
        setIsThinking(false);
      }
    });

    service.onStatus((status) => {
      setConnectionStatus(status);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setIsThinking(true);
    elevenLabsService.current.sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    setIsThinking(true);
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
          bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto
          transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
        `}
      >
        <div className="size-full flex flex-col">
          {/* Header / Main Content Container */}
          <div className="box-border flex-1 flex flex-col items-start justify-between p-[32px] relative size-full overflow-hidden w-full">

            {/* Top Section: Header & Chat History */}
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">

              {/* Header */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <div className="content-stretch flex gap-[13px] items-center relative shrink-0">
                  <div className="relative rounded-[99px] shrink-0 size-[40px]" data-name="1725289156788 1">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[99px] size-full" src={imgProfile} />
                  </div>
                  <div className="flex flex-col font-uber font-bold justify-center leading-[1.1] not-italic relative shrink-0 text-[16px] text-black">
                    <p className="mb-0">Aaron</p>
                    <p className="text-[12px] font-normal opacity-60">
                      {connectionStatus === 'connected' && '🟢 Connected'}
                      {connectionStatus === 'connecting' && '🟡 Connecting...'}
                      {connectionStatus === 'disconnected' && '🔴 Disconnected'}
                      {connectionStatus === 'error' && '🔴 Error'}
                    </p>
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
                <div className="content-stretch flex flex-col gap-[20px] items-start relative w-full">
                  {messages.length === 0 && (
                    <div className="text-center w-full py-8 text-black/40 font-uber">
                      <p>Start a conversation with Aaron!</p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`content-stretch flex flex-col gap-[10px] ${message.role === 'user' ? 'items-end' : 'items-start'} justify-center relative shrink-0 w-full`}
                    >
                      {message.role === 'user' ? (
                        <div className="bg-black box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[32px] shrink-0 max-w-[80%]">
                          <p className="font-uber font-medium leading-[1.7] not-italic relative text-[15px] text-white tracking-[0.45px]">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                          <p className="font-uber font-medium leading-[1.7] not-italic relative text-[15px] text-black tracking-[0.45px]">
                            {message.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {isThinking && (
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                      <div className="flex gap-1">
                        <span className="animate-bounce inline-block w-2 h-2 bg-black/40 rounded-full" style={{ animationDelay: '0ms' }}></span>
                        <span className="animate-bounce inline-block w-2 h-2 bg-black/40 rounded-full" style={{ animationDelay: '150ms' }}></span>
                        <span className="animate-bounce inline-block w-2 h-2 bg-black/40 rounded-full" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Bottom Section: Input & Suggestions */}
            <div className="relative shrink-0 w-full mt-4">
              <div className="box-border content-stretch flex flex-col gap-[16px] items-start relative w-full">

                {/* Input Area */}
                <div className="bg-white content-stretch flex flex-col items-start relative rounded-[32px] shrink-0 w-full shadow-sm">
                  <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_4px_32px_0px_rgba(0,0,0,0.08)]" />

                  {/* Text Input Wrapper */}
                  <div className="relative shrink-0 w-full">
                    <div className="flex flex-row items-center size-full">
                      <div className="box-border content-stretch flex gap-[10px] items-center px-[24px] py-[16px] relative w-full">
                        <textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Ask me anything"
                          className="font-uber font-medium leading-[1.7] w-full resize-none outline-none border-none bg-transparent p-0 text-[15px] text-black placeholder:text-[rgba(0,0,0,0.7)] tracking-[0.45px] min-h-[24px] max-h-[120px]"
                          rows={1}
                          style={{ fieldSizing: 'content' } as any}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Send Button Wrapper */}
                  <div className="relative shrink-0 w-full">
                    <div className="flex flex-row items-center justify-end size-full">
                      <div className="box-border content-stretch flex gap-[10px] items-center justify-end p-[16px] relative w-full pt-0">
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim() || connectionStatus !== 'connected'}
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
                  <div className="content-stretch flex flex-wrap gap-[7px] items-center relative shrink-0 w-full">
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