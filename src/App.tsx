import { Portfolio } from "./components/Portfolio";

export default function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=Beth+Ellen&family=Manrope:wght@400;500;700&display=swap');
          
          .font-uber {
            font-family: 'Manrope', sans-serif;
          }
          .font-formula {
            font-family: 'Antonio', sans-serif;
            font-stretch: condensed;
          }
          .font-beth {
            font-family: 'Beth Ellen', cursive;
          }
          
          body {
            background: linear-gradient(180deg, #0a0a0a 0%, #3a1c1c 100%);
            min-height: 100vh;
          }
        `
      }} />
      <Portfolio />
    </>
  );
}
