import { useEffect, useRef, useState } from "react";
import type { GameState } from "../../types";
import type { Resolution } from "../../engine/engine";
import {
  MARKETS,
  allBought,
  buy,
  canBuy,
  finish,
  jumpsBefore,
  marketResult,
  neededCount,
  boughtNeeded,
  outOfStock,
  priceAt,
  startMarket,
  tick,
  walkTo,
} from "../../engine/market";

const BUY_MSG: Record<string, string> = {
  out: "Sạp này vừa hết hàng!",
  poor: "Không đủ tiền!",
  enough: "Món này đủ rồi.",
};

function StallPicture({ id }: { id: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "gao") return <svg viewBox="0 0 80 52" aria-hidden="true"><path {...common} d="M24 8h32l8 34c-13 6-35 6-48 0L24 8Z" /><path {...common} d="M25 18c10 5 20-5 30 0M33 34c4-8 9-8 14 0" /></svg>;
  if (id === "muoi") return <svg viewBox="0 0 80 52" aria-hidden="true"><path {...common} d="M27 15h26l5 29H22l5-29ZM30 15l3-8h14l3 8" /><path {...common} d="M35 28h10M40 23v10" /></svg>;
  if (id === "mam" || id === "dau") return <svg viewBox="0 0 80 52" aria-hidden="true"><path {...common} d="M32 7h16v9l6 8v20H26V24l6-8V7ZM32 16h16M27 29h26" /></svg>;
  if (id === "vai") return <svg viewBox="0 0 80 52" aria-hidden="true"><path {...common} d="M17 13h46v31H17zM17 22h46M28 13v31" /><path {...common} d="m38 30 8 7 12-13" /></svg>;
  if (id === "keo") return <svg viewBox="0 0 80 52" aria-hidden="true"><path {...common} d="m17 18 13 8v14l-13 7-7-14 7-15Zm46 0-13 8v14l13 7 7-14-7-15ZM30 26h20v14H30z" /></svg>;
  return <svg viewBox="0 0 80 52" aria-hidden="true"><path {...common} d="M23 21 40 8l17 13v23H23V21Z" /><circle {...common} cx="40" cy="29" r="7" /></svg>;
}

export function MarketGame({ state, id, onResolve }: { state: GameState; id: string; onResolve: (r: Resolution) => void }) {
  const cfg = MARKETS[id];
  const seed = state.seed + cfg.year;
  const [phase, setPhase] = useState<"intro" | "play" | "end">("intro");
  const [m, setM] = useState(() => startMarket(cfg));
  const [msg, setMsg] = useState("");
  const [jumpFlash, setJumpFlash] = useState(false);
  const last = useRef<number | null>(null);
  const jumps = useRef(0);

  // Vòng thời gian
  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    const loop = (now: number) => {
      const dt = last.current === null ? 0 : (now - last.current) / 1000;
      last.current = now;
      setM((s) => tick(cfg, s, Math.min(dt, 0.1)));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      last.current = null;
    };
  }, [phase, cfg]);

  // Giá nhảy vọt
  useEffect(() => {
    const j = jumpsBefore(cfg, m.t);
    if (j > jumps.current) {
      jumps.current = j;
      setJumpFlash(true);
      const t = window.setTimeout(() => setJumpFlash(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [m.t, cfg]);

  useEffect(() => {
    if (phase === "play" && m.done) setPhase("end");
  }, [m.done, phase]);

  function press(stallId: string) {
    if (phase !== "play") return;
    if (m.at === stallId && !m.walkingTo) {
      const r = canBuy(cfg, m, seed);
      if (r === "ok") {
        setM((s) => buy(cfg, s, seed));
        setMsg("");
      } else setMsg(BUY_MSG[r] ?? "");
    } else {
      setM((s) => walkTo(cfg, s, stallId));
      setMsg("");
    }
  }

  // Phím tắt: 1–7 chọn sạp, Space/Enter mua ở sạp đang đứng
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= cfg.stalls.length) {
        e.preventDefault();
        press(cfg.stalls[n - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const result = () => onResolve({ type: "minigame", result: marketResult(cfg, m) });
  const skip = () =>
    onResolve({ type: "minigame", result: { score: 0, bought: 0, needed: neededCount(cfg), extras: 0, moneyLeft: cfg.budget, seconds: 0, skipped: true } });

  if (phase === "intro") {
    return (
      <>
        <div className="kind-label">Tự tay chơi · năm {cfg.year}</div>
        <h2>{cfg.title}</h2>
        <p className="q">{cfg.intro}</p>
        <ul className="small">
          <li>Bấm vào một sạp để đi tới. Đến nơi, bấm lần nữa để mua (hoặc phím số 1–{cfg.stalls.length}).</li>
          <li>Có {cfg.durationSec} giây. Mua đủ danh sách càng nhanh càng nhiều điểm.</li>
        </ul>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" onClick={() => setPhase("play")} autoFocus>
            Ra chợ
          </button>
          <button className="btn ghost" onClick={skip}>
            Bỏ qua
          </button>
        </div>
      </>
    );
  }

  if (phase === "end") {
    const r = marketResult(cfg, m);
    return (
      <>
        <div className="kind-label">Kết quả · năm {cfg.year}</div>
        <h2>{r.bought >= r.needed ? "Mua đủ rồi!" : "Chưa mua đủ…"}</h2>
        <p className="q">
          Mua được {r.bought}/{r.needed} món trong {r.seconds} giây, còn {r.moneyLeft} đồng.
          {r.extras > 0 && ` Còn mua thêm ${r.extras} món quà.`}
        </p>
        <p className="mg-score">
          Điểm: <strong>{r.score}</strong>/100
        </p>
        <button className="btn primary" onClick={result} autoFocus>
          Sống tiếp
        </button>
      </>
    );
  }

  const left = cfg.durationSec - m.t;
  return (
    <div className={`market${jumpFlash ? " jump" : ""}`}>
      <div className="mg-top">
        <div>
          <div className="kind-label">{cfg.title}</div>
          <div className="mg-money">
            Tiền: <strong>{m.money}</strong> đồng
          </div>
        </div>
        <div className={`mg-time${left < 8 ? " low" : ""}`} aria-live="polite">
          {Math.ceil(left)}s
        </div>
      </div>
      <div className="mg-bar" aria-hidden="true">
        <span style={{ width: `${(m.t / cfg.durationSec) * 100}%` }} />
      </div>
      <div className="mg-list" aria-label="Danh sách cần mua">
        Cần mua:{" "}
        {Object.entries(cfg.need).map(([sid, q]) => {
          const got = Math.min(q, m.bought[sid] ?? 0);
          const label = cfg.stalls.find((x) => x.id === sid)?.label;
          return (
            <span key={sid} className={got >= q ? "ok" : ""}>
              {label} {got}/{q}
            </span>
          );
        })}
        <span className="muted">
          ({boughtNeeded(cfg, m)}/{neededCount(cfg)})
        </span>
      </div>
      {jumpFlash && <div className="mg-alert">Giá lên!</div>}
      <div className="stalls">
        {cfg.stalls.map((s, i) => {
          const out = outOfStock(cfg, s.id, m.t, seed);
          const here = m.at === s.id && !m.walkingTo;
          const going = m.walkingTo === s.id;
          const extra = cfg.need[s.id] === undefined;
          return (
            <button
              key={s.id}
              className={`stall${here ? " here" : ""}${going ? " going" : ""}${out ? " out" : ""}${extra ? " extra" : ""}`}
              onClick={() => press(s.id)}
              aria-label={`${i + 1}. ${s.label}, giá ${priceAt(cfg, s.id, m.t)}${out ? ", hết hàng" : ""}`}
            >
              <span className="key mono">{i + 1}</span>
              <span className="stall-picture"><StallPicture id={s.id} /></span>
              <span className="name">{s.label}</span>
              <span className="price mono">{out ? "hết hàng" : `${priceAt(cfg, s.id, m.t)} đ`}</span>
              <span className="who">{here ? "Bạn ở đây · bấm để mua" : going ? "Đang đi tới…" : extra ? "quà, không bắt buộc" : ""}</span>
            </button>
          );
        })}
      </div>
      <div className="row" style={{ justifyContent: "space-between", marginTop: 10 }}>
        <span className="mg-msg" role="status">
          {msg}
        </span>
        <button className="btn" onClick={() => setM((s) => finish(s))}>
          {allBought(cfg, m) ? "Về nhà" : "Thôi, về nhà"}
        </button>
      </div>
    </div>
  );
}
