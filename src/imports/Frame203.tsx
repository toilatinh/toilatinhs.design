import svgPaths from "./svg-guhmyy87us";

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[24px] py-[16px] relative w-full">
          <p className="font-['Uber_Move:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[15px] text-[rgba(0,0,0,0.7)] text-nowrap text-right tracking-[0.45px] whitespace-pre">Ask me anything</p>
        </div>
      </div>
    </div>
  );
}

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

function Frame() {
  return (
    <div className="bg-black overflow-clip relative rounded-[9999px] shrink-0 size-[32px]">
      <ArrowUp />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[24px] py-[16px] relative w-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[24px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.07)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="font-['Uber_Move:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-right tracking-[0.42px] whitespace-pre">What is your design philosophy?</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.07)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="font-['Uber_Move:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-right tracking-[0.42px] whitespace-pre">What motivates you at work?</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[7px] items-center overflow-clip relative shrink-0 w-full">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

export default function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-start relative size-full">
      <Frame6 />
      <Frame3 />
    </div>
  );
}