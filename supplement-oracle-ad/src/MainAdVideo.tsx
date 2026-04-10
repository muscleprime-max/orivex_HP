import { AbsoluteFill, Sequence } from "remotion";
import { SCENES, VIDEO } from "./constants";
import { Background } from "./components/Background";
import { OpeningHook } from "./scenes/OpeningHook";
import { ProblemScene } from "./scenes/ProblemScene";
import { ProductReveal } from "./scenes/ProductReveal";
import { BenefitScene } from "./scenes/BenefitScene";
import { ClosingCTA } from "./scenes/ClosingCTA";

// ============================================================
//  MainAdVideo — メインコンポジション
//
//  動画スペック: 1080x1920 / 30fps / 24秒 (720f)
//
//  シーン構成:
//  Scene1   0〜 90f  (0〜3s)    OpeningHook  — フック
//  Scene2  90〜240f  (3〜8s)    ProblemScene — 課題提示
//  Scene3 240〜390f  (8〜13s)   ProductReveal— プロダクト紹介
//  Scene4 390〜570f  (13〜19s)  BenefitScene — ベネフィット
//  Scene5 570〜720f  (19〜24s)  ClosingCTA   — CTA
//
//  各シーンは内部でフェードイン/アウトを管理。
//  背景 (Background) は全シーンで共有。
// ============================================================

export const MainAdVideo: React.FC = () => {
  // 合計 720f = 24秒 であることを確認
  const totalFrames =
    SCENES.hook.durationInFrames +
    SCENES.problem.durationInFrames +
    SCENES.reveal.durationInFrames +
    SCENES.benefits.durationInFrames +
    SCENES.cta.durationInFrames;

  if (totalFrames !== VIDEO.durationInFrames) {
    console.warn(
      `[MainAdVideo] シーン合計フレーム数 (${totalFrames}) が VIDEO.durationInFrames (${VIDEO.durationInFrames}) と一致しません。`
    );
  }

  return (
    <AbsoluteFill>

      {/* ── 共通背景 (全シーン共有) ── */}
      <Background />

      {/* ── Scene 1: OpeningHook ── */}
      <Sequence
        from={SCENES.hook.from}
        durationInFrames={SCENES.hook.durationInFrames}
        name="Scene1-Hook"
      >
        <OpeningHook />
      </Sequence>

      {/* ── Scene 2: ProblemScene ── */}
      <Sequence
        from={SCENES.problem.from}
        durationInFrames={SCENES.problem.durationInFrames}
        name="Scene2-Problem"
      >
        <ProblemScene />
      </Sequence>

      {/* ── Scene 3: ProductReveal ── */}
      <Sequence
        from={SCENES.reveal.from}
        durationInFrames={SCENES.reveal.durationInFrames}
        name="Scene3-Reveal"
      >
        <ProductReveal />
      </Sequence>

      {/* ── Scene 4: BenefitScene ── */}
      <Sequence
        from={SCENES.benefits.from}
        durationInFrames={SCENES.benefits.durationInFrames}
        name="Scene4-Benefits"
      >
        <BenefitScene />
      </Sequence>

      {/* ── Scene 5: ClosingCTA ── */}
      <Sequence
        from={SCENES.cta.from}
        durationInFrames={SCENES.cta.durationInFrames}
        name="Scene5-CTA"
      >
        <ClosingCTA />
      </Sequence>

    </AbsoluteFill>
  );
};
