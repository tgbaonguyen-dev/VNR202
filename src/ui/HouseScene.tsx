import type { GameState, HouseKey } from "../types";
import { ITEM_BY_ID } from "../data/items";
import { ItemSlot } from "./ItemSlot";

// Cảnh ngôi nhà và làng, vẽ bằng SVG nên không cần ảnh ngoài.
// Chỉ đọc state: nhà đổi theo houseStage, house (điện, tivi, xe…), năm và các cánh cửa đã mở.

const STAGE_NAME = { 1: "Nhà tranh vách đất", 2: "Nhà mái tôn", 3: "Nhà gạch mái ngói", 4: "Nhà kiên cố hai tầng" } as const;

export function HouseScene({ s }: { s: GameState }) {
  const has = (k: HouseKey) => s.house.includes(k);
  const fresh = new Set(s.houseChanges.map((c) => c.key));
  const f = (k: string) => (fresh.has(k as HouseKey) ? "fresh" : undefined);
  const y = s.year;
  const elec = has("electric");
  const road = has("road");
  const stage = s.houseStage;
  const factory = s.unlocked.includes("kcn") && y >= 1999;
  const tower = y >= 2013;
  const school = s.unlocked.includes("ntm") && y >= 2013;
  const ripe = y >= 1989; // sau Khoán 10: lúa dày hơn
  const label = `${STAGE_NAME[stage]}, năm ${y}. ${s.house.map((k) => k).length} thay đổi trong nhà.`;

  return (
    <section className="panel scene-panel">
      <div className="panel-head">
        <h3>Nhà bạn năm {y}</h3>
        <span className="mono muted">{STAGE_NAME[stage]}</span>
      </div>
      <svg className="scene" viewBox="0 0 640 250" role="img" aria-label={label}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sky)" />
            <stop offset="1" stopColor="var(--card)" />
          </linearGradient>
        </defs>
        <rect width="640" height="250" fill="url(#sky)" />

        {/* Hậu cảnh: lũy tre, đồi; sau này nhà máy, trường, cột sóng */}
        <path d="M0 120 Q80 92 160 112 T320 106 T480 110 T640 100 V150 H0Z" fill="var(--field)" opacity="0.45" />
        {[30, 70, 110, 520, 560, 600].map((x) => (
          <g key={x} transform={`translate(${x} 96)`}>
            <path d="M0 40 C2 20 -6 8 2 0 M6 40 C8 18 14 10 10 0 M-6 40 C-6 24 -14 14 -10 4" stroke="#4f6b2c" strokeWidth="3" fill="none" />
          </g>
        ))}
        {factory && (
          <g className={y < 2001 ? "fresh" : undefined} transform="translate(470 74)">
            <rect x="0" y="20" width="70" height="36" fill="#9aa3a8" stroke="var(--line)" strokeWidth="2" />
            <path d="M0 20 l12 -10 v10 l12 -10 v10 l12 -10 v10" fill="#9aa3a8" stroke="var(--line)" strokeWidth="2" />
            <rect x="52" y="-6" width="9" height="26" fill="#7c8589" stroke="var(--line)" strokeWidth="2" />
            <text x="35" y="44" textAnchor="middle" fontSize="9" fill="var(--line)">Nhà máy</text>
          </g>
        )}
        {school && (
          <g transform="translate(330 78)">
            <rect x="0" y="10" width="78" height="40" fill="#f0d27a" stroke="var(--line)" strokeWidth="2" />
            <line x1="0" y1="30" x2="78" y2="30" stroke="var(--line)" strokeWidth="1.5" />
            {[8, 26, 44, 62].map((x) => (
              <rect key={x} x={x} y="15" width="9" height="10" fill="#8fb6d6" />
            ))}
            <path d="M-4 10 L39 -4 L82 10Z" fill="#b5523b" stroke="var(--line)" strokeWidth="2" />
            <text x="39" y="45" textAnchor="middle" fontSize="8" fill="var(--line)">Trường học</text>
          </g>
        )}
        {tower && (
          <g transform="translate(250 40)">
            <path d="M0 80 L8 0 L16 80 M3 50 H13 M5 28 H11" stroke="#5d6b75" strokeWidth="2.5" fill="none" />
            <circle cx="8" cy="0" r="3" fill="var(--accent)" />
          </g>
        )}

        {/* Ruộng */}
        <rect x="0" y="150" width="640" height="100" fill="var(--field)" />
        {Array.from({ length: ripe ? 26 : 11 }).map((_, i) => {
          const x = 380 + ((i * 47) % 250);
          const yy = 160 + ((i * 29) % 34);
          return <path key={i} d={`M${x} ${yy + 10} q2 -8 6 -10 M${x + 3} ${yy + 10} q0 -9 -4 -11`} stroke={ripe ? "#d8b43c" : "#6f8a3a"} strokeWidth="2" fill="none" />;
        })}

        {/* Đường làng: đất có ổ gà, hoặc bê tông có đèn */}
        <g className={f("road")}>
          {road ? (
            <>
              <rect x="0" y="214" width="640" height="36" fill="#b8b4aa" />
              <line x1="0" y1="232" x2="640" y2="232" stroke="#f3efe2" strokeWidth="3" strokeDasharray="18 14" />
              <g transform="translate(560 150)">
                <line x1="0" y1="64" x2="0" y2="0" stroke="#55606a" strokeWidth="3" />
                <path d="M0 0 h14" stroke="#55606a" strokeWidth="3" />
                <circle cx="15" cy="3" r="4" fill={elec ? "#ffe27a" : "#ccc"} />
              </g>
            </>
          ) : (
            <>
              <rect x="0" y="214" width="640" height="36" fill="#9a7a52" />
              <ellipse cx="120" cy="232" rx="22" ry="5" fill="#7c6040" />
              <ellipse cx="420" cy="240" rx="28" ry="5" fill="#7c6040" />
            </>
          )}
        </g>

        {/* Cột điện và dây */}
        {elec && (
          <g className={f("electric")}>
            <line x1="40" y1="214" x2="40" y2="92" stroke="#6b5a45" strokeWidth="5" />
            <line x1="28" y1="100" x2="52" y2="100" stroke="#6b5a45" strokeWidth="4" />
            <path d="M52 100 Q120 116 186 120" stroke="var(--line)" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* Ao cá */}
        {has("pond") && <ellipse className={f("pond")} cx="300" cy="196" rx="48" ry="12" fill="#6fa3c4" stroke="var(--line)" strokeWidth="2" />}

        {/* Ngôi nhà theo giai đoạn */}
        <g className={f("stage")} transform="translate(150 0)">
          {stage === 4 ? (
            <>
              <rect x="0" y="86" width="140" height="128" fill="#f2e3c6" stroke="var(--line)" strokeWidth="2.5" />
              <line x1="0" y1="150" x2="140" y2="150" stroke="var(--line)" strokeWidth="2" />
              <rect x="10" y="140" width="120" height="8" fill="#c8b48e" stroke="var(--line)" strokeWidth="1.5" />
              <path d="M-8 86 L70 54 L148 86Z" fill="#b5523b" stroke="var(--line)" strokeWidth="2.5" />
              <Window x={18} y={100} lit={elec} pc={has("computer")} />
              <Window x={92} y={100} lit={elec} />
              <Window x={18} y={162} lit={elec} />
              <rect x="58" y="164" width="28" height="50" fill="#8a5a33" stroke="var(--line)" strokeWidth="2" />
            </>
          ) : (
            <>
              <rect x="0" y="130" width="140" height="84" fill={stage === 3 ? "#c9714d" : "#b99668"} stroke="var(--line)" strokeWidth="2.5" />
              {stage === 3 && [146, 162, 178, 194].map((yy) => <line key={yy} x1="0" y1={yy} x2="140" y2={yy} stroke="#a85a3a" strokeWidth="1" />)}
              <path
                d="M-14 130 L70 82 L154 130Z"
                fill={stage === 1 ? "#d9bf72" : stage === 2 ? "#9aa1a5" : "#b5523b"}
                stroke="var(--line)"
                strokeWidth="2.5"
              />
              {stage === 1 && [92, 104, 116].map((yy) => <path key={yy} d={`M${70 - (yy - 82) * 1.7} ${yy + 8} H${70 + (yy - 82) * 1.7}`} stroke="#a88d45" strokeWidth="2" />)}
              {stage === 2 && [-6, 14, 34, 54, 74, 94, 114, 134].map((x) => <line key={x} x1={x} y1="128" x2={70 + (x - 70) * 0.2} y2="88" stroke="#7d8488" strokeWidth="1" />)}
              <Window x={16} y={150} lit={elec} pc={has("computer")} />
              <Window x={98} y={150} lit={elec} />
              <rect x="56" y="160" width="28" height="54" fill="#6b4a2c" stroke="var(--line)" strokeWidth="2" />
            </>
          )}
          {/* Ăng-ten tivi */}
          {has("tv") && (
            <g className={f("tv")} transform={stage === 4 ? "translate(100 30)" : "translate(96 66)"}>
              <line x1="0" y1="30" x2="0" y2="0" stroke="var(--line)" strokeWidth="2" />
              <path d="M-12 4 H12 M-9 10 H9 M-6 16 H6" stroke="var(--line)" strokeWidth="2" />
            </g>
          )}
          {/* Bồn nước */}
          {has("water") && (
            <g className={f("water")} transform={stage === 4 ? "translate(14 60)" : "translate(150 150)"}>
              <rect x="0" y="0" width="22" height="26" rx="5" fill="#d6dde2" stroke="var(--line)" strokeWidth="2" />
            </g>
          )}
          {/* Biển cửa hàng */}
          {has("sign") && (
            <g className={f("sign")} transform={stage === 4 ? "translate(36 152)" : "translate(36 136)"}>
              <rect width="68" height="14" fill="#2f6db5" stroke="var(--line)" strokeWidth="1.5" />
              <text x="34" y="11" textAnchor="middle" fontSize="10" fill="#fff">CỬA HÀNG</text>
            </g>
          )}
        </g>

        {/* Xe đạp, xe máy, thùng hàng */}
        {has("bike") && (
          <g className={f("bike")} transform="translate(310 188)">
            <circle cx="0" cy="18" r="9" fill="none" stroke="var(--line)" strokeWidth="2.5" />
            <circle cx="30" cy="18" r="9" fill="none" stroke="var(--line)" strokeWidth="2.5" />
            <path d="M0 18 L12 4 L24 4 L30 18 M12 4 L16 18 L24 4 M10 0 H16 M24 4 L26 -2" stroke="var(--line)" strokeWidth="2.5" fill="none" />
          </g>
        )}
        {has("motorbike") && (
          <g className={f("motorbike")} transform="translate(356 184)">
            <circle cx="4" cy="22" r="10" fill="#333" />
            <circle cx="44" cy="22" r="10" fill="#333" />
            <path d="M4 22 L16 6 H34 L44 22 Z" fill="#c23b2e" stroke="var(--line)" strokeWidth="2" />
            <path d="M34 6 L38 -4 H46" stroke="var(--line)" strokeWidth="3" fill="none" />
          </g>
        )}
        {has("boxes") && (
          <g className={f("boxes")} transform="translate(116 186)">
            <rect x="0" y="10" width="20" height="18" fill="#c99c5d" stroke="var(--line)" strokeWidth="1.5" />
            <rect x="14" y="0" width="18" height="16" fill="#d8ad6c" stroke="var(--line)" strokeWidth="1.5" />
            <rect x="22" y="14" width="18" height="14" fill="#c99c5d" stroke="var(--line)" strokeWidth="1.5" />
          </g>
        )}

        <text x="626" y="22" textAnchor="end" fontSize="20" fontWeight="700" fill="var(--line)" opacity="0.65" fontFamily="var(--serif)">
          {y}
        </text>
      </svg>

      {s.houseChanges.length > 0 && (
        <div className="scene-new" aria-live="polite">
          {s.houseChanges.map((c) => (
            <span key={c.key + c.label} className={`tag ${c.by}`}>
              {c.label}: {c.by === "doimoi" ? "Nhờ Đổi mới" : "Nhờ lựa chọn của bạn"}
            </span>
          ))}
        </div>
      )}

      {s.items.length > 0 && (
        <div className="scene-items" aria-label="Đồ trong nhà">
          {s.items.map((id) => (
            <div key={id} className={`scene-item${s.newItems.includes(id) ? " fresh" : ""}`} title={ITEM_BY_ID[id]?.name}>
              <ItemSlot id={id} small />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Window({ x, y, lit, pc = false }: { x: number; y: number; lit: boolean; pc?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="26" height="22" fill={pc ? "#9cc9f0" : lit ? "#ffe9a3" : "#e0a95a"} opacity={lit || pc ? 1 : 0.55} stroke="var(--line)" strokeWidth="2" />
      <line x1="13" y1="0" x2="13" y2="22" stroke="var(--line)" strokeWidth="1.5" />
    </g>
  );
}
