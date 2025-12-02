import imgRectangle5 from "figma:asset/da1798c2b0957b1351283eef59e942311a4437ff.png";
import imgProfile from "figma:asset/6f425ab7a2319fc065c66c69e67abde5cdbaf375.png";
import imgBackground from "figma:asset/93719b15b0d98e9a4d86c4df7becdc392a9c3d30.png";

function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${imgBackground}')`,
        }}
      />
      {/* Optional noise overlay if still desired, otherwise just the image */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay">
        {/* Noise texture from Figma */}
        <div
          className="absolute inset-0 bg-repeat opacity-50"
          style={{
            backgroundImage: `url('${imgRectangle5}')`,
            backgroundSize: "533.333px 533.333px",
          }}
        />
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <nav className="flex font-uber gap-[12px] items-center justify-center leading-[1.7] text-[15px] text-white/40 tracking-[0.45px] mb-[60px] sm:mb-[134px] w-full max-w-[636px] mx-auto px-6 sm:px-0">
      <a
        href="https://drive.google.com/file/d/10xFeXzz7nBeD9DeeA03Ox0jqFnbsZWh2/view?usp=drive_link"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors font-[TT_Hoves_Pro]"
      >
        Resume
      </a>
      <a
        href="https://medium.com/@aarontn"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors font-[TT_Hoves_Pro]"
      >
        Thoughts
      </a>
      <a
        href="https://dribbble.com/toilatinhs"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors font-[TT_Hoves_Pro]"
      >
        Playground
      </a>
      <a
        href="https://www.linkedin.com/in/aarontinh/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors font-[TT_Hoves_Pro]"
      >
        Linkedin
      </a>
    </nav>
  );
}

function ProfileHeader() {
  return (
    <div className="flex items-start justify-between w-full mb-[60px]">
      <div className="relative w-[81px] h-[80px] rounded-full overflow-hidden shrink-0">
        <img
          alt="Profile"
          className="absolute inset-0 w-full h-full object-cover"
          src={imgProfile}
        />
      </div>
      <div className="flex flex-col font-formula justify-center leading-[0.95] text-[16px] text-black text-center tracking-[-0.16px] uppercase">
        <p className="m-0">Build the</p>
        <p className="m-0">AI world</p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[24px] items-start leading-[1.7] text-[15px] text-black tracking-[0.45px] w-full">
      <h3 className="font-uber font-bold min-w-full m-0 font-[ABeeZee]">
        {title}
      </h3>
      <div className="font-uber font-medium w-full max-w-[540px]">
        {children}
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex flex-col gap-[50px] items-start w-full">
      {/* Title */}
      <div className="flex flex-col font-uber font-bold justify-center leading-[1.1] text-[32px] text-black tracking-[-1.28px]">
        <p className="m-0">Aaron</p>
        <p className="m-0">Sr. Product Designer (AI)</p>
      </div>

      <Section title="Mission">
        <p className="mb-6 font-[TT_Hoves_Pro]">
          The builder, human-first designer. I founded The
          Unlimited Humanity Company and buidling @explow to
          predict possible future self to for human’s
          self-continuety. And more AI products in the future.
        </p>
        <p className="font-[TT_Hoves_Pro]">
          My mission is to build a world of AI that is
          responsible, ethical, and free of side effects. AI
          that does not reduce human value or leave people
          behind, but makes human life brighter.
          <br />
          <br />
          Currently dedicated to developing immersive products
          within the artificial intelligence space.
        </p>
      </Section>

      <Section title="Work">
        <p className="mb-6 font-[TT_Hoves_Pro]">
          My most recent chapter began in 2023, when I joined
          the Murror AI with a mission to help young people
          through self-discovery and depression prevention. I
          lead AI behavior design, shaping how the AI thinks,
          speaks, and interacts as a supportive companion. This
          work now powers the entire product and has contributed
          to strong early PMF signals.
        </p>
        <p className="mb-6 font-[TT_Hoves_Pro]">
          Before that, I worked at One Mount, where I owned the
          Voucher domain in the VinID (now OneU) app, serving
          millions of users. I contributed across the full
          product cycle, research, usability testing,
          interviews, UI, and measurement. I also led the
          Loyalty Operation project between Techcombank and
          VinID and built cross-team design processes for squads
          in both the North and South.
        </p>
        <p className="mb-6 font-[TT_Hoves_Pro]">
          Earlier in my career, at age 20, I became a Product
          Designer at Pixie, where I built a mentoring platform
          that connected learners with industry mentors.
        </p>
        <p className="mb-6 text-[15px] font-[TT_Hoves_Pro]">
          At 19, I started as a Visual Designer, my first
          professional design role.
        </p>
        <p className="text-[15px] font-[TT_Hoves_Pro]">
          And my journey began even earlier—with aesthetics. As
          a high school student, I earned my first income as a
          mobile photographer, discovering my passion for visual
          storytelling.
        </p>
      </Section>

      <Section title="Life">
        <p className="font-[TT_Hoves_Pro]">
          I average 4km of swimming, 10km of running, and 20km
          of cycling per week. I’ve been slowing down so I can
          stay focused in a world full of noise. Tech moves
          crazy fast, focus is the only way to see what really
          matters.
        </p>
      </Section>
    </div>
  );
}

function Signature() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-10">
      <div className="flex items-center justify-center relative w-[221px] h-[143px]">
        <div className="rotate-[-4deg]">
          <div className="font-beth leading-[1.09] text-[58px] text-black text-center tracking-[1.17px]">
            <p className="m-0">human</p>
            <p className="m-0">first</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-formula justify-center leading-[0.95] text-[16px] text-black text-center tracking-[-0.16px] uppercase">
        <p className="m-0">Product</p>
        <p className="m-0">Designer</p>
      </div>
    </div>
  );
}

function CardFooterNav() {
  return (
    <nav className="flex font-uber gap-[12px] items-center justify-center leading-[1.7] text-[15px] text-black/40 tracking-[0.45px] w-full">
      <a
        href="#"
        className="hover:text-black transition-colors font-[TT_Hoves_Pro]"
      >
        Resume
      </a>
      <a
        href="#"
        className="hover:text-black transition-colors font-[TT_Hoves_Pro]"
      >
        Thoughts
      </a>
      <a
        href="#"
        className="hover:text-black transition-colors font-[TT_Hoves_Pro]"
      >
        Playground
      </a>
      <a
        href="#"
        className="hover:text-black transition-colors font-[TT_Hoves_Pro]"
      >
        Linkedin
      </a>
    </nav>
  );
}

import { ChatWidget } from "./ChatWidget";
import { ChatOverlay } from "./ChatOverlay";
import { useState } from "react";

export function Portfolio() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>("");

  const handleOpenChat = (message?: string) => {
    if (message) {
      setInitialMessage(message);
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setInitialMessage("");
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center pt-[35px] pb-[100px]">
      <Background />

      <div className="relative z-10 w-full max-w-[636px] flex flex-col gap-[10px] px-4 sm:px-0">
        <TopNav />

        <main className="bg-white w-full box-border flex flex-col gap-[74px] items-center overflow-hidden p-[32px] sm:p-[48px] mb-[280px]">
          <div className="w-full flex flex-col gap-[60px]">
            <ProfileHeader />
            <MainContent />
          </div>

          <Signature />
          <CardFooterNav />
        </main>
      </div>

      {!isChatOpen && <ChatWidget onOpen={handleOpenChat} />}
      <ChatOverlay isOpen={isChatOpen} onClose={handleCloseChat} initialMessage={initialMessage} />
    </div>
  );
}