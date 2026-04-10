import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants";

// ============================================================
//  Background — 全シーン共通の背景レイヤー
//  視認性改善: やや明るめのドットグリッド + ソフトグロー
// ============================================================

export const Background: React.FC = () => (
  <AbsoluteFill>
    {/* ① ベース: 深みのあるダークネイビー */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #080e1d 0%, ${COLORS.bg} 55%, #060b16 100%)`,
      }}
    />

    {/* ② 中央上寄り: 青のソフトグロー (少し強め) */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 85% 52% at 50% 38%, rgba(59,130,246,0.09) 0%, rgba(6,182,212,0.04) 55%, transparent 100%)",
      }}
    />

    {/* ③ 下部: 自然な暗さ */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 32%)",
      }}
    />

    {/* ④ 微細ドットグリッド (視認性のため少し明るく) */}
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(rgba(100,160,255,0.28) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        opacity: 0.2,
      }}
    />
  </AbsoluteFill>
);
