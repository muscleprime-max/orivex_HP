import { COLORS, FONT } from "../constants";

// ============================================================
//  MockUI — ツール UI のモックコンポーネント群
//  実際のツール (松13.1.html) のデザイン言語に準拠
// ============================================================

const baseFont: React.CSSProperties = { fontFamily: FONT.family };

// --- ツールカードのベース ---
export const MockCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glowIntensity?: number; // 0-1
}> = ({ children, style, glowIntensity = 0.5 }) => (
  <div
    style={{
      ...baseFont,
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.borderBlue}`,
      borderRadius: 20,
      padding: "28px 32px",
      boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 40px rgba(59,130,246,${glowIntensity * 0.07})`,
      ...style,
    }}
  >
    {children}
  </div>
);

// --- カードヘッダー ---
export const MockCardHeader: React.FC<{ title: string; badge?: string }> = ({
  title,
  badge,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${COLORS.borderBlue}`,
      paddingBottom: 16,
      marginBottom: 20,
    }}
  >
    <div>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        {title}
      </div>
    </div>
    {badge && (
      <div
        style={{
          background: "rgba(59,130,246,0.15)",
          border: `1px solid ${COLORS.borderBlueMid}`,
          color: COLORS.blueLight,
          borderRadius: 20,
          padding: "4px 14px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        {badge}
      </div>
    )}
  </div>
);

// --- インプットフィールド ---
export const MockInput: React.FC<{
  label: string;
  value: string;
  highlighted?: boolean;
}> = ({ label, value, highlighted = false }) => (
  <div style={{ marginBottom: 14 }}>
    <div
      style={{
        color: COLORS.textSub,
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 5,
        letterSpacing: 0.5,
        textTransform: "uppercase" as const,
      }}
    >
      {label}
    </div>
    <div
      style={{
        background: COLORS.bgInput,
        border: `1px solid ${highlighted ? COLORS.blue : COLORS.borderBlue}`,
        borderRadius: 10,
        padding: "11px 16px",
        color: highlighted ? COLORS.textPrimary : COLORS.textSub,
        fontSize: 13,
        letterSpacing: 0.2,
        boxShadow: highlighted ? `0 0 0 2px rgba(59,130,246,0.12)` : "none",
      }}
    >
      {value}
    </div>
  </div>
);

// --- 生成ボタン ---
export const MockGenerateButton: React.FC<{ label?: string }> = ({
  label = "✦ 提案を生成する",
}) => (
  <div
    style={{
      background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
      color: COLORS.white,
      borderRadius: 12,
      padding: "17px 24px",
      textAlign: "center" as const,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: 0.5,
      boxShadow: `0 0 32px ${COLORS.blueGlow}, 0 8px 24px rgba(0,0,0,0.3)`,
      marginTop: 4,
    }}
  >
    {label}
  </div>
);

// --- サプリ提案カード (Lane A: 推奨 / Lane B: 条件付き) ---
export const MockSuppCard: React.FC<{
  name: string;
  timing: string;
  score?: string;
  lane?: "a" | "b";
  note?: string;
}> = ({ name, timing, score, lane = "b", note }) => {
  const isA = lane === "a";
  return (
    <div
      style={{
        background: isA ? COLORS.successBg : COLORS.warningBg,
        border: `1px solid ${isA ? COLORS.successBorder : COLORS.warningBorder}`,
        borderLeft: `4px solid ${isA ? COLORS.success : COLORS.warning}`,
        borderRadius: 10,
        padding: "11px 16px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: note ? 5 : 0,
        }}
      >
        <div style={{ color: COLORS.textPrimary, fontSize: 13, fontWeight: 700 }}>
          {name}
        </div>
        {score && (
          <div
            style={{
              background: isA ? COLORS.success : COLORS.warning,
              color: "#fff",
              borderRadius: 6,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {score}
          </div>
        )}
      </div>
      <div style={{ color: COLORS.textSub, fontSize: 11 }}>{timing}</div>
      {note && (
        <div
          style={{
            marginTop: 6,
            padding: "5px 10px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 6,
            color: "#f87171",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

// --- チャットバブル (LINE風) ---
export const MockChatBubble: React.FC<{
  text: string;
  isUser?: boolean;
  time?: string;
}> = ({ text, isUser = false, time }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column" as const,
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: 10,
    }}
  >
    {!isUser && (
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.25)",
          border: `1px solid ${COLORS.borderBlue}`,
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: COLORS.blueLight,
          fontWeight: 700,
        }}
      >
        C
      </div>
    )}
    <div
      style={{
        background: isUser ? "rgba(30, 58, 138, 0.85)" : "rgba(30, 41, 59, 0.9)",
        border: `1px solid ${isUser ? "rgba(59,130,246,0.3)" : "rgba(71,85,105,0.4)"}`,
        color: COLORS.textPrimary,
        borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        padding: "9px 14px",
        maxWidth: "82%",
        fontSize: 12,
        lineHeight: 1.6,
      }}
    >
      {text}
    </div>
    {time && (
      <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 3 }}>{time}</div>
    )}
  </div>
);

// --- チェックリストアイテム ---
export const MockCheckItem: React.FC<{
  label: string;
  checked?: boolean;
  sub?: string;
}> = ({ label, checked = false, sub }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "9px 12px",
      background: checked ? "rgba(15, 37, 68, 0.8)" : "rgba(17, 24, 39, 0.7)",
      borderRadius: 8,
      marginBottom: 6,
      border: `1px solid ${checked ? COLORS.borderBlueMid : "rgba(71,85,105,0.2)"}`,
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        border: `2px solid ${checked ? COLORS.blue : COLORS.textDim}`,
        borderRadius: 4,
        background: checked ? COLORS.blue : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L4 7L9 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <div>
      <div
        style={{
          color: checked ? COLORS.textPrimary : COLORS.textSub,
          fontSize: 12,
          fontWeight: checked ? 600 : 400,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 2 }}>{sub}</div>
      )}
    </div>
  </div>
);

// --- フロースtep (Scene3 用) ---
export const MockFlowStep: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  isCenter?: boolean;
}> = ({ icon, title, subtitle, isCenter = false }) => (
  <div
    style={{
      background: isCenter
        ? `linear-gradient(135deg, rgba(29,78,216,0.3), rgba(6,182,212,0.15))`
        : COLORS.bgCard,
      border: `1px solid ${isCenter ? COLORS.borderBlueMid : COLORS.borderBlue}`,
      borderRadius: 18,
      padding: "24px 20px",
      textAlign: "center" as const,
      flex: 1,
      boxShadow: isCenter
        ? `0 0 30px rgba(59,130,246,0.18), 0 12px 30px rgba(0,0,0,0.3)`
        : `0 8px 24px rgba(0,0,0,0.25)`,
    }}
  >
    <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
    <div
      style={{
        color: isCenter ? COLORS.blueLight : COLORS.textPrimary,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 0.5,
        marginBottom: 6,
      }}
    >
      {title}
    </div>
    <div style={{ color: COLORS.textSub, fontSize: 11, lineHeight: 1.5 }}>
      {subtitle}
    </div>
  </div>
);

// --- 矢印 (フロー接続) ---
export const FlowArrow: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      color: COLORS.blue,
      flexShrink: 0,
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke={COLORS.blue}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// --- ベネフィットカード (Scene4 用) ---
export const BenefitBlock: React.FC<{
  number: string;
  headline: string;
  body: string;
  icon: React.ReactNode;
}> = ({ number, headline, body, icon }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 28,
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.borderBlue}`,
      borderRadius: 20,
      padding: "28px 32px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
    }}
  >
    {/* 番号 + アイコン */}
    <div style={{ flexShrink: 0, textAlign: "center" as const }}>
      <div
        style={{
          color: COLORS.blue,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2,
          marginBottom: 8,
          opacity: 0.6,
        }}
      >
        {number}
      </div>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.12)",
          border: `1px solid ${COLORS.borderBlueMid}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
    </div>
    {/* テキスト */}
    <div style={{ flex: 1 }}>
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: -0.5,
          lineHeight: 1.2,
          marginBottom: 8,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          color: COLORS.textSub,
          fontSize: 14,
          lineHeight: 1.5,
          letterSpacing: 0.2,
        }}
      >
        {body}
      </div>
    </div>
  </div>
);

// --- アクセント区切り線 ---
export const AccentDivider: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.cyan}, ${COLORS.blue}, transparent)`,
      opacity: opacity * 0.4,
      margin: "0 auto",
      width: "80%",
    }}
  />
);
