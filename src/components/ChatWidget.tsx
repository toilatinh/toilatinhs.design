import React, { useState } from 'react';
import svgPaths from "../imports/svg-guhmyy87us";

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

function SendButton({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-black overflow-hidden relative rounded-full shrink-0 size-[32px] flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer border-none p-0"
    >
      <ArrowUp />
    </button>
  );
}

function SuggestionPill({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white hover:bg-gray-50 transition-colors box-border flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-full shrink-0 border-none cursor-pointer"
    >
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.07)] border-solid inset-0 pointer-events-none rounded-full" />
      <span className="font-uber font-medium leading-[1.7] text-[14px] text-black text-nowrap text-right tracking-[0.42px]">
        {text}
      </span>
    </button>
  );
}

export function ChatWidget({ onOpen }: { onOpen?: () => void }) {
  const [inputValue, setInputValue] = useState("");

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    onOpen?.();
  };

  const handleInputClick = () => {
    onOpen?.();
  };

  return (
    <div className="fixed bottom-[32px] left-1/2 -translate-x-1/2 z-50 w-full max-w-[360px] px-4 sm:px-0">
      <div className="content-stretch flex flex-col gap-[21px] items-start relative size-full">
        
        {/* Input Area */}
        <div 
          className="bg-white content-stretch flex flex-col items-start relative rounded-[24px] shrink-0 w-full shadow-sm cursor-pointer"
          onClick={handleInputClick}
        >
          <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
          
          {/* Text Input */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex gap-[10px] items-center px-[24px] py-[16px] relative w-full">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onClick={(e) => { e.stopPropagation(); handleInputClick(); }}
                  placeholder="Ask me anything"
                  className="font-uber font-medium leading-[1.7] w-full resize-none outline-none border-none bg-transparent p-0 text-[15px] text-black placeholder:text-[rgba(0,0,0,0.5)] tracking-[0.45px] min-h-[24px] max-h-[120px] cursor-pointer"
                  rows={1}
                  style={{ fieldSizing: 'content' } as any}
                />
              </div>
            </div>
          </div>

          {/* Send Button Area */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center justify-end size-full">
              <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[24px] py-[16px] relative w-full pt-[0px] pr-[16px] pb-[16px] pl-[24px]">
                <SendButton onClick={() => console.log("Send:", inputValue)} />
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex overflow-hidden w-full select-none rounded-[999px]">
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
          `}</style>
          
          <div className="flex shrink-0 gap-[16px] pr-[16px] items-center animate-marquee">
            <SuggestionPill 
              text="What is your design philosophy?" 
              onClick={() => handleSuggestionClick("What is your design philosophy?")} 
            />
            <SuggestionPill 
              text="What motivates you at work?" 
              onClick={() => handleSuggestionClick("What motivates you at work?")} 
            />
          </div>

          <div aria-hidden="true" className="flex shrink-0 gap-[16px] pr-[16px] items-center animate-marquee">
            <SuggestionPill 
              text="What is your design philosophy?" 
              onClick={() => handleSuggestionClick("What is your design philosophy?")} 
            />
            <SuggestionPill 
              text="What motivates you at work?" 
              onClick={() => handleSuggestionClick("What motivates you at work?")} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
