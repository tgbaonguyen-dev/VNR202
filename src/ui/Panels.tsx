import { useState } from "react";
import type { GameState, StatKey } from "../types";
import { FAMILY_BY_ID, FOCUS, STAT_LABELS } from "../data/people";
import { TP_BY_ID } from "../data/turningPoints";
import { HISTORY } from "../data/history";
import { ITEM_BY_ID } from "../data/items";
import { careerLevel, careerTitle, education, formatMoney, incomeGroup, netWorth, occupation, assets, peerStatus, residence } from "../engine/life";
import type { FocusId } from "../types";
import { ripplesReached } from "../engine/engine";
import { CONGRESSES } from "../data/congresses";

const FAMILY_DOTS: Record<string, number> = { itruong: 1, dongcon: 2, ongba: 3, anhchixa: 3, conmot: 3 };

export function Avatar({ file, fallbackColor }: { file: string; fallbackColor: string }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img className="avatar-img" src={`/images/avatar/${file}.png`} alt="" onError={() => setOk(false)} />
  ) : (
    <svg className="avatar-img" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill={fallbackColor} />
      <circle cx="32" cy="26" r="12" fill="#f3e9d2" stroke="#2b2118" strokeWidth="3" />
      <path d="M12 64 Q32 36 52 64Z" fill="#f3e9d2" stroke="#2b2118" strokeWidth="3" />
    </svg>
  );
}

// ---------------------------------------------------------------- Hồ sơ

export function ProfileCard({ s }: { s: GameState }) {
  const occ = occupation(s);
  const rows: [string, React.ReactNode][] = [
    ["Giới tính", s.gender],
    ["Sinh", `tháng ${s.birthMonth} năm 1985`],
    ["Nơi sống", residence(s)],
    [
      "Hoàn cảnh",
      <span key="h">
        {FAMILY_BY_ID[s.familyId].name}{" "}
        <span className="dots" aria-label={`mức ${FAMILY_DOTS[s.familyId]} trên 5`}>
          {"●".repeat(FAMILY_DOTS[s.familyId])}
          {"○".repeat(5 - FAMILY_DOTS[s.familyId])}
        </span>
      </span>,
    ],
    ["Học vấn", education(s)],
  ];
  if (s.age >= 15) rows.push(["Nghề nghiệp", occ.job]);
  if (s.age >= 18 && !occ.student) rows.push(["Chức vụ", careerTitle(s)]);
  rows.push(["Ước mơ thuở nhỏ", s.dream]);

  return (
    <section className="panel profile">
      <header className="strip">
        <span>Hồ sơ cá nhân</span>
        <span>1985</span>
      </header>
      <div className="profile-body">
        <Avatar file={s.gender === "Nam" ? "player-nam" : "player-nu"} fallbackColor="#e0a458" />
        <div>
          <h2 className="name">{s.nickname}</h2>
          <dl className="kv">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Trạng thái và tài chính

const BAR_COLOR: Record<StatKey, string> = { health: "#2e7d4f", happy: "#b07a1f", know: "#1f7a7a", bond: "#9b2242" };

export function StatusCard({ s }: { s: GameState }) {
  const [open, setOpen] = useState(false);
  const adult = s.age >= 18;
  const worth = netWorth(s);
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Trạng thái</h3>
        <span className="mono muted">0–100</span>
      </div>
      {(Object.keys(STAT_LABELS) as StatKey[]).map((k) => (
        <div className="statrow" key={k}>
          <span>{STAT_LABELS[k]}</span>
          <div className="bar" role="meter" aria-label={STAT_LABELS[k]} aria-valuenow={Math.round(s.stats[k])} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${s.stats[k]}%`, background: BAR_COLOR[k] }} />
          </div>
          <span className="mono">{Math.round(s.stats[k])}</span>
        </div>
      ))}
      <button className="linkbtn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "▾" : "▸"} Các chỉ số này nghĩa là gì?
      </button>
      {open && (
        <p className="small">
          Bốn chỉ số là thiết kế của trò chơi, không đo được ngoài đời. Chúng thay đổi theo trọng tâm mỗi năm, các lựa chọn và sự kiện. Không có chỉ số nào là điểm số để so với người khác.
        </p>
      )}

      <div className="money-grid">
        <div>
          <div className="small muted">Tài sản ròng</div>
          <div className="big-num">{adult ? formatMoney(worth) : "—"}</div>
          {!adult && <div className="small">Vẫn sống cùng bố mẹ</div>}
        </div>
        <div>
          <div className="small muted">Thu nhập hằng tháng</div>
          <div className="big-num">{adult && s.fin.income > 0 ? formatMoney(s.fin.income / 12) : "—"}</div>
          <div className="small">Thu nhập gia đình: nhóm {incomeGroup(s)}/5</div>
        </div>
        {adult && (
          <>
            <div>
              <div className="small muted">Tiền tiết kiệm</div>
              <div className="mid-num">{formatMoney(s.fin.savings)}</div>
            </div>
            <div>
              <div className="small muted">Nợ</div>
              <div className={`mid-num${s.fin.debt > 0 ? " warn" : ""}`}>{s.fin.debt > 0 ? formatMoney(s.fin.debt) : "Không nợ"}</div>
            </div>
          </>
        )}
      </div>
      {s.age < 23 && (
        <div className="famfund">
          <div className="small muted">Tiền nhà bố mẹ</div>
          <ul className="assets">
            <li>
              <span>Bố mẹ làm ra mỗi năm</span>
              <span className="mono">{formatMoney(s.fin.famIncome)}</span>
            </li>
            <li>
              <span>Đang để dành</span>
              <span className="mono">{formatMoney(s.fin.famSavings)}</span>
            </li>
            {s.fin.famDebt > 0 && (
              <li>
                <span>Đang vay họ hàng</span>
                <span className="mono warn">{formatMoney(s.fin.famDebt)}</span>
              </li>
            )}
          </ul>
        </div>
      )}
      {adult && assets(s).length > 0 && (
        <ul className="assets">
          {assets(s).map((a) => (
            <li key={a.label}>
              <span>{a.label}</span>
              <span className="mono">{formatMoney(a.value)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="tiny muted">Quy theo giá năm 2025. Số tiền là ước lượng minh họa của trò chơi, không phải số liệu thống kê.</p>
    </section>
  );
}

// ---------------------------------------------------------------- Trọng tâm năm nay

const HINT_LABEL: Record<string, string> = { health: "Sức khỏe", happy: "Hạnh phúc", know: "Tri thức", bond: "Gắn kết", money: "Thu nhập", career: "Thăng tiến" };

function hints(effects: Record<string, number | undefined>): string {
  return Object.entries(effects)
    .filter(([, v]) => v)
    .map(([k, v]) => `${HINT_LABEL[k]}${(v as number) > 0 ? "↑" : "↓"}${Math.abs(v as number) === 1 ? " một chút" : ""}`)
    .join(", ");
}

export function FocusCard({ s, onFocus, onSpend }: { s: GameState; onFocus: (f: FocusId) => void; onSpend: () => void }) {
  const adult = s.age >= 18;
  const occ = occupation(s);
  const opts = FOCUS.filter((f) => f.adult === adult);
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Trọng tâm năm nay</h3>
        {s.age >= 5 && <span className="mono muted">Có thể đổi bất cứ lúc nào</span>}
      </div>
      <p className="role">
        <strong>{occ.job}</strong> <span className="muted">{residence(s)}</span>
      </p>
      {s.age < 5 ? (
        <p className="small">
          Bạn còn bé, được bố mẹ chăm bẵm. Từ năm 5 tuổi bạn có thể chọn dồn sức cho điều gì mỗi năm. Bạn cứ thoải mái tua nhanh giai đoạn này ở tốc độ 8× hoặc 16×.
        </p>
      ) : (
        <div className="focus-grid" role="group" aria-label="Năm nay dồn sức cho">
          {opts.map((f) => (
            <button key={f.id} className="focus-btn" aria-pressed={s.focus === f.id} onClick={() => onFocus(f.id)}>
              <span>{f.label}</span>
              <small>{hints(f.effects as Record<string, number>)}</small>
            </button>
          ))}
        </div>
      )}
      {adult && (
        <button className="btn small-btn" onClick={onSpend}>
          Chi tiêu, đầu tư
        </button>
      )}
      {!adult && s.age >= 4 && (
        <button className="btn small-btn" onClick={onSpend}>
          Xin bố mẹ
        </button>
      )}
      {adult && careerLevel(s) > 0 && <p className="tiny muted">Dồn sức cho "Làm việc" giúp thăng tiến nhanh hơn và thu nhập cao hơn.</p>}
    </section>
  );
}

// ---------------------------------------------------------------- Gia đình và cuộc đời

export function FamilyCard({ s }: { s: GameState }) {
  const p = s.people;
  const fa = s.year - p.father.birthYear;
  const mo = s.year - p.mother.birthYear;
  const parentJob = (job: string, age: number) => (age >= 60 ? `nghỉ làm, trước ${job}` : job);
  const kids = p.children.filter((y) => y <= s.year);
  const hobby = s.choices.tp2009 ? TP_BY_ID.tp2009.options.find((o) => o.id === s.choices.tp2009)?.label : undefined;
  const sib =
    p.siblings === 0
      ? "Không có"
      : s.familyId === "dongcon"
      ? `${p.siblings} người, có cả anh chị lẫn em${s.year >= 2010 ? ", đều đã có gia đình riêng" : ""}`
      : `${p.siblings} người${p.siblingsOlder ? (s.year >= 2000 ? ", đều đã có gia đình riêng" : ", đều lớn hơn bạn") : s.year >= 2012 ? ", đều đã đi làm" : ", đều nhỏ hơn bạn"}`;
  return (
    <section className="panel">
      <h3>Gia đình và cuộc đời</h3>
      <dl className="kv right">
        <div>
          <dt>Bố</dt>
          <dd>
            {p.father.name}, {fa} tuổi<br />
            <small className="muted">{parentJob(p.father.job, fa)}</small>
          </dd>
        </div>
        <div>
          <dt>Mẹ</dt>
          <dd>
            {p.mother.name}, {mo} tuổi<br />
            <small className="muted">{parentJob(p.mother.job, mo)}</small>
          </dd>
        </div>
        {p.grandparents && (
          <div>
            <dt>Ông bà</dt>
            <dd>Sống cùng nhà</dd>
          </div>
        )}
        <div>
          <dt>Anh chị em</dt>
          <dd>{sib}</dd>
        </div>
        {p.spouse && (
          <div>
            <dt>{s.gender === "Nam" ? "Vợ" : "Chồng"}</dt>
            <dd>
              {p.spouse.name}, cưới năm {p.spouse.since}
            </dd>
          </div>
        )}
        {kids.length > 0 && (
          <div>
            <dt>Con</dt>
            <dd>{kids.map((y) => `${s.year - y} tuổi`).join(", ")}</dd>
          </div>
        )}
        <div>
          <dt>Bạn thân</dt>
          <dd>
            {s.friend.name}
            <small className="muted">{s.marks.includes("thanban") ? ", thân thiết từ nhỏ" : ", bạn thơ ấu"}</small>
          </dd>
        </div>
        {hobby && (
          <div>
            <dt>Sở thích</dt>
            <dd>{hobby}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------- Bạn cùng xóm

export function PeersCard({ s }: { s: GameState }) {
  const list = [
    { name: s.friend.name, gender: s.friend.pronoun === "cô ấy" ? "Nữ" : "Nam", choices: s.friend.choices, best: true },
    ...s.peers.map((p) => ({ ...p, best: false })),
  ];
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Bạn cùng xóm, sinh năm 1985</h3>
        <span className="mono muted">Ở đúng độ tuổi này</span>
      </div>
      <ul className="peers">
        {list.map((p) => (
          <li key={p.name}>
            <div>
              <strong>{p.name}</strong>
              <div className="small muted">
                {p.gender}
                {p.best ? ", bạn thân" : ""}
              </div>
            </div>
            <span className="small">{peerStatus(p.choices, s.age)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------- Bản đồ cuộc đời

export function LifeMap({ s, compact = false }: { s: GameState; compact?: boolean }) {
  const years = Array.from({ length: 41 }, (_, i) => 1985 + i);
  const bigYears = new Set(HISTORY.filter((h) => h.big).map((h) => h.year));
  return (
    <section className={`panel${compact ? " flat" : ""}`}>
      <div className="panel-head">
        <h3>Bản đồ cuộc đời</h3>
        <span className="mono muted">1 ô = 1 năm</span>
      </div>
      <div className="lifemap">
        {years.map((y) => {
          const snap = s.timeline.find((t) => t.year === y);
          const cards = s.feed.filter((c) => c.year === y);
          const epic = cards.some((c) => c.itemId && ITEM_BY_ID[c.itemId]?.rarity === "epic");
          const decided = cards.some((c) => c.kind === "choice");
          const mark = epic ? "★" : decided ? "◆" : bigYears.has(y) && snap ? "Đ" : "";
          const mood = snap ? (snap.stats.happy + snap.stats.health) / 2 : 0;
          const tone = !snap ? "future" : mood >= 75 ? "t4" : mood >= 62 ? "t3" : mood >= 50 ? "t2" : "t1";
          const title = snap
            ? `${y} (${y - 1985} tuổi)${cards.length ? ": " + cards.slice(0, 2).map((c) => c.text).join(" / ") : ""}`
            : `${y}`;
          return (
            <span key={y} className={`cell ${tone}${y === s.year ? " now" : ""}`} title={title}>
              {mark}
            </span>
          );
        })}
      </div>
      <p className="tiny muted">Màu đậm: năm khỏe và vui. Đ: mốc lớn của đất nước. ◆: năm bạn đưa ra lựa chọn. ★: kỷ vật rất hiếm.</p>
    </section>
  );
}

// ---------------------------------------------------------------- Quỹ đạo cuộc đời

export function Trajectory({ s }: { s: GameState }) {
  const W = 420;
  const H = 220;
  const pad = 26;
  const x = (y: number) => pad + ((y - 1985) / 40) * (W - pad * 2);
  const yv = (v: number) => H - pad - (v / 100) * (H - pad * 2);
  const keys = Object.keys(STAT_LABELS) as StatKey[];
  return (
    <div>
      <svg className="trajectory" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Biểu đồ bốn chỉ số qua 40 năm">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={pad} x2={W - pad} y1={yv(v)} y2={yv(v)} stroke="rgba(0,0,0,.12)" />
            <text x={4} y={yv(v) + 4} fontSize="12" fill="#6e5d47">
              {v}
            </text>
          </g>
        ))}
        {[1985, 1995, 2005, 2015, 2025].map((y) => (
          <text key={y} x={x(y)} y={H - 6} fontSize="12" textAnchor="middle" fill="#6e5d47">
            {y}
          </text>
        ))}
        {keys.map((k) => (
          <polyline
            key={k}
            fill="none"
            stroke={BAR_COLOR[k]}
            strokeWidth="2.5"
            strokeLinejoin="round"
            points={s.timeline.map((t) => `${x(t.year)},${yv(t.stats[k])}`).join(" ")}
          />
        ))}
      </svg>
      <div className="legend">
        {keys.map((k) => (
          <span key={k}>
            <i style={{ background: BAR_COLOR[k] }} />
            {STAT_LABELS[k]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Đổi mới đến nhà bạn

export function DoiMoiCard({ s }: { s: GameState }) {
  const list = ripplesReached(s);
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Đổi mới đến nhà bạn</h3>
        <span className="mono muted">{list.length} thay đổi</span>
      </div>
      {list.length === 0 ? (
        <p className="small muted">Chưa có gì. Các mốc lịch sử sẽ dần chạm tới làng và nhà bạn.</p>
      ) : (
        <ul className="ripples">
          {[...list].reverse().map((r) => (
            <li key={r.id}>
              <span className="mono muted">{r.from}</span>
              <span>{r.short}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- Dòng thời gian Đổi mới

/** Nhiệm kỳ Đại hội đang diễn ra ở năm này */
export function termOf(year: number) {
  const past = CONGRESSES.filter((c) => c.year <= year);
  if (past.length === 0) return null;
  const c = past[past.length - 1];
  const next = CONGRESSES.find((x) => x.year > c.year);
  return { c, to: next ? next.year : null };
}

export function DoiMoiTimeline({ s, from, to }: { s: GameState; from: number; to: number }) {
  const pos = (y: number) => `${((y - from) / (to - from)) * 100}%`;
  const term = termOf(s.year);
  return (
    <div className="dmtl">
      <div className="dmtl-label">
        <strong>{term ? `Nhiệm kỳ Đại hội ${term.c.num}` : "Trước Đổi mới"}</strong>
        <span className="muted">{term ? ` · ${term.c.year}–${term.to ?? "nay"}` : " · 1985"}</span>
      </div>
      <div className="dmtl-track" role="img" aria-label={`Dòng thời gian Đổi mới, đang ở năm ${s.year}`}>
        {CONGRESSES.map((c, i) => {
          const end = CONGRESSES[i + 1]?.year ?? to;
          return <span key={c.year} className={`dmtl-term${i % 2 ? " alt" : ""}${s.year >= c.year ? " past" : ""}`} style={{ left: pos(c.year), width: `calc(${pos(end)} - ${pos(c.year)})` }} />;
        })}
        {HISTORY.filter((h) => !CONGRESSES.some((c) => c.year === h.year)).map((h) => (
          <span key={h.year} className={`dmtl-dot${s.year >= h.year ? " past" : ""}`} style={{ left: pos(h.year) }} title={`${h.year}: ${h.text}`} />
        ))}
        {CONGRESSES.map((c) => (
          <span key={c.year} className={`dmtl-dh${s.year >= c.year ? " past" : ""}`} style={{ left: pos(c.year) }} title={`${c.year}: Đại hội ${c.num}`}>
            {c.num}
          </span>
        ))}
        <span className="dmtl-now" style={{ left: pos(s.year) }} />
      </div>
      <div className="dmtl-years mono">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}
