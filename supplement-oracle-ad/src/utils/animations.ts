import { interpolate, spring } from "remotion";

// ============================================================
//  アニメーションユーティリティ
// ============================================================

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/** シーン全体のフェードイン/アウト opacity を返す */
export function sceneOpacity(
  frame: number,
  totalFrames: number,
  fadeInFrames = 8,
  fadeOutFrames = 10
): number {
  return interpolate(
    frame,
    [0, fadeInFrames, totalFrames - fadeOutFrames, totalFrames],
    [0, 1, 1, 0],
    CLAMP
  );
}

/** フェードイン opacity (startFrame から durationFrames かけて 0→1) */
export function fadeIn(frame: number, startFrame: number, durationFrames = 12): number {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], CLAMP);
}

/** Y 方向スプリングスライドイン — translateY の値を返す */
export function springSlideY(
  frame: number,
  startFrame: number,
  fps: number,
  fromY = 50,
  config = { damping: 20, stiffness: 85, mass: 1 }
): number {
  const p = spring({ frame: frame - startFrame, fps, config });
  return interpolate(p, [0, 1], [fromY, 0]);
}

/** X 方向スプリングスライドイン — translateX の値を返す */
export function springSlideX(
  frame: number,
  startFrame: number,
  fps: number,
  fromX = 60,
  config = { damping: 20, stiffness: 85, mass: 1 }
): number {
  const p = spring({ frame: frame - startFrame, fps, config });
  return interpolate(p, [0, 1], [fromX, 0]);
}

/** スプリングスケール (0.8→1.0 など) */
export function springScale(
  frame: number,
  startFrame: number,
  fps: number,
  fromScale = 0.8,
  config = { damping: 18, stiffness: 80, mass: 1 }
): number {
  const p = spring({ frame: frame - startFrame, fps, config });
  return interpolate(p, [0, 1], [fromScale, 1.0]);
}

/** 線形フェードイン (opacity 0→1) + Y スライド (fromY→0) をまとめて返す */
export function fadeSlideIn(
  frame: number,
  startFrame: number,
  durationFrames = 14,
  fromY = 24
): { opacity: number; translateY: number } {
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    CLAMP
  );
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [fromY, 0],
    CLAMP
  );
  return { opacity, translateY };
}
