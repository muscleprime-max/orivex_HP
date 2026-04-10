import { Composition } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { MainAdVideo } from "./MainAdVideo";
import { LineChatMockup } from "./scenes/LineChatMockup";
import { OracleMonetization } from "./scenes/OracleMonetization";
import { OracleSafetyEvidence } from "./scenes/OracleSafetyEvidence";
import { OracleStandardization } from "./scenes/OracleStandardization";
import { DigitalDetox } from "./scenes/DigitalDetox";
import { VIDEO } from "./constants";

// Load Noto Sans JP for Japanese text rendering
// This is handled automatically by Remotion before rendering
loadFont("normal", {
  weights: ["400", "600", "700", "900"],
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MainAdVideo"
      component={MainAdVideo}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="LineChatMockup"
      component={LineChatMockup}
      durationInFrames={930}
      fps={60}
      width={1080}
      height={1920}
    />
    <Composition
      id="OracleMonetization"
      component={OracleMonetization}
      durationInFrames={1080}
      fps={60}
      width={1080}
      height={1920}
    />
    <Composition
      id="OracleSafetyEvidence"
      component={OracleSafetyEvidence}
      durationInFrames={1080}
      fps={60}
      width={1080}
      height={1920}
    />
    <Composition
      id="OracleStandardization"
      component={OracleStandardization}
      durationInFrames={1080}
      fps={60}
      width={1080}
      height={1920}
    />
    <Composition
      id="DigitalDetox"
      component={DigitalDetox}
      durationInFrames={1140}
      fps={60}
      width={1080}
      height={1920}
    />
  </>
);
