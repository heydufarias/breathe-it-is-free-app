import { AnimatePresence } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { MainContent } from "./components/MainContent";
import { modeStyles } from "./lib/consts";
import { cn } from "./lib/utils";
import { state } from "./state/state";

export default function App() {
  const currentMode = state.use((value) => value.currentMode);
  const isSessionActive = state.use(
    (value) => value.sessionStage !== "idle"
  );
  const [showInfo, setShowInfo] = useState(false);

  const openInfo = () => setShowInfo(true);
  const closeInfo = () => setShowInfo(false);

  useLayoutEffect(() => {
    document.documentElement.className = modeStyles[currentMode].bgSurface;
  }, [currentMode]);

  return (
    <div
      className={cn(
        "relative flex flex-col h-dvh w-full font-helvetica transition-colors duration-500",
        modeStyles[currentMode].bgSurface,
        modeStyles[currentMode].text
      )}
    >
      <Header
        showInfoButton={!isSessionActive}
        onInfoButtonClick={openInfo}
      />

      <MainContent />

      <Footer />

      <AnimatePresence>
        {showInfo && <Info onClose={closeInfo} />}
      </AnimatePresence>
    </div>
  );
}