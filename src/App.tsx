import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import dufariasImage from "./assets/images/dufarias.jpg";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { MainContent } from "./components/MainContent";
import { Profile } from "./components/Profile";
import { useFavicon } from "./hooks/useFavicon";
import { usePreloadImage } from "./hooks/usePreloadImage";
import { modeStyles } from "./lib/consts";
import { cn } from "./lib/utils";
import { state } from "./state/state";

export default function App() {
  const currentMode = state.use((value) => value.currentMode);
  const isSessionActive = state.use(
    (value) => value.sessionStage !== "idle"
  );
  const [showInfo, setShowInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const openInfo = () => setShowInfo(true);
  const closeInfo = () => setShowInfo(false);

  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);

  useLayoutEffect(() => {
    document.documentElement.className = modeStyles[currentMode].bgSurface;
  }, [currentMode]);

  useFavicon(currentMode);
  usePreloadImage(dufariasImage);

  return (
    <div
      className={cn(
        "relative flex flex-col h-dvh w-full",
        "font-helvetica font-semibold",
        "transition-colors duration-500",
        modeStyles[currentMode].bgSurface,
        modeStyles[currentMode].text
      )}
    >
      <Header
        showInfoButton={!isSessionActive}
        onInfoButtonClick={openInfo}
      />

      <MainContent />

      <Footer
        currentMode={currentMode}
        onCreditClick={openProfile}
      />

      <AnimatePresence>
        {showInfo && <Info onClose={closeInfo} />}
        {showProfile &&
          <Profile
            currentMode={currentMode}
            onClose={closeProfile}
          />}
      </AnimatePresence>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}