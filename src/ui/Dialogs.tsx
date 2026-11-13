import { useEffect, useRef, useState } from "react";
import type { GameState, Pending } from "../types";
import type { Resolution } from "../engine/engine";
import { isLocked, kidMemory, schoolNote, storyLines } from "../engine/engine";
import { KID_REQUEST_BY_ID } from "../data/requests";
import { formatMoney } from "../engine/life";
import { TP_BY_ID } from "../data/turningPoints";
import { CONGRESS_BY_YEAR } from "../data/congresses";
import { REFLECTIONS } from "../data/people";
import { HoiDoBox } from "./HoiDoBox";
import { Avatar } from "./Panels";
import { MarketGame } from "./minigames/Market";

interface Props {
  state: GameState;
  pending: Pending;
  onResolve: (r: Resolution) => void;
}

export function PendingDialog({ state, pending, onResolve }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("button:not(:disabled), input")?.focus();
  }, [pending]);

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className={`dialog${pending.type === "reunion" ? " wide" : ""}`} ref={ref}>
        {pending.type === "turning" && <Turning state={state} id={pending.id} onResolve={onResolve} />}
        {pending.type === "reunion" && <Reunion state={state} onResolve={onResolve} />}
        {pending.type === "reflection" && <ReflectionBox id={pending.id} onResolve={onResolve} />}
        {pending.type === "minigame" && <MarketGame key={pending.id} state={state} id={pending.id} onResolve={onResolve} />}
        {pending.type === "kidask" && <KidAsk state={state} id={pending.id} childAge={pending.childAge} onResolve={onResolve} />}
        {pending.type === "outcome" && (
          <>
            <h2>{pending.title}</h2>
            <p className="q">{pending.text}</p>
            <HoiDoBox id={pending.hoiDoId} />
            <div className="row" style={{ marginTop: 18 }}>
              <button className="btn primary" onClick={() => onResolve({ type: "outcome" })}>
                Sống tiếp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Turning({ state, id, onResolve }: { state: GameState; id: string; onResolve: (r: Resolution) => void }) {
  const tp = TP_BY_ID[id];
  const dh = tp.id.startsWith("dh") ? CONGRESS_BY_YEAR[tp.year] : undefined;
  if (dh) {
    return (
      <div className="vankien">
        <div className="vk-head">
          <span className="vk-year mono">{tp.year}</span>
          <h2>Đại hội {dh.num}</h2>
        </div>
        <ol className="vk-steps">
          <li>
            <span className="vk-tier">Đất nước</span>
            <p>{dh.focus}</p>
          </li>
          <li>
            <span className="vk-tier">Ở xã bạn</span>
            <p>{dh.local}</p>
          </li>
          <li>
            <span className="vk-tier">Nhà bạn</span>
            <p>{tp.question}</p>
          </li>
        </ol>
        <div className="options">
          {tp.options.map((o) => (
            <button key={o.id} className="option" onClick={() => onResolve({ type: "turning", optionId: o.id })}>
              {o.label}
            </button>
          ))}
        </div>
        <p className="tiny muted">Định hướng Đại hội theo Giáo trình Lịch sử Đảng Cộng sản Việt Nam. Chuyện ở xã và nhà bạn là hư cấu.</p>
      </div>
    );
  }
  return (
    <>
      {tp.quick ? <div className="kind-label">Lựa chọn của riêng bạn, năm {tp.year}</div> : null}
      <h2>{tp.quick ? tp.title : `${tp.year}: ${tp.title}`}</h2>
      <p className="q">{tp.question}</p>
      {state.age < 23 && tp.options.some((o) => schoolNote(state, o.id)) && (
        <p className="famnote">
          Chuyện học phải bàn với bố mẹ. Nhà bạn đang để dành khoảng <strong>{formatMoney(state.fin.famSavings)}</strong>
          {state.fin.famDebt > 0 && <>, còn nợ {formatMoney(state.fin.famDebt)}</>}.
        </p>
      )}
      <div className="options">
        {tp.options.map((o) => {
          const locked = isLocked(state, o);
          const note = state.age < 23 ? schoolNote(state, o.id) : null;
          return (
            <button key={o.id} className="option" disabled={locked} onClick={() => onResolve({ type: "turning", optionId: o.id })}>
              {o.label}
              {locked && <span className="lock">Chưa có: {o.lockedReason}</span>}
              {!locked && note && <span className="lock">{note}</span>}
            </button>
          );
        })}
      </div>
      {state.settings.features.hoiDo && <HoiDoBox id={tp.hoiDoId} />}
    </>
  );
}

function Reunion({ state, onResolve }: { state: GameState; onResolve: (r: Resolution) => void }) {
  const tp = TP_BY_ID["tp2022"];
  const lines = storyLines(state);
  return (
    <>
      <h2>2022: Buổi họp làng và người bạn cũ</h2>
      <p className="q">
        Ở buổi họp làng bàn về chương trình giảm nghèo bền vững, bạn gặp lại {state.friend.name}. Hai người ngồi kể cho nhau nghe những năm qua.
      </p>
      <div className="reunion">
        <div className="person">
          <div className="avatar"><Avatar file={state.gender === "Nam" ? "player-nam" : "player-nu"} fallbackColor="#e0a458" /></div>
          <h3>{state.nickname}</h3>
          <ul>{lines.self.length ? lines.self.map((l) => <li key={l}>{l}.</li>) : <li>Mình vẫn gắn bó với làng.</li>}</ul>
        </div>
        <div className="person">
          <div className="avatar"><Avatar file={state.friend.pronoun === "cô ấy" ? "friend-nu" : "friend-nam"} fallbackColor="#588157" /></div>
          <h3>{state.friend.name}</h3>
          <ul>{lines.friend.length ? lines.friend.map((l) => <li key={l}>{l}.</li>) : <li>{state.friend.name} vẫn gắn bó với làng.</li>}</ul>
        </div>
      </div>
      <p className="q">{tp.question}</p>
      <div className="options">
        {tp.options.map((o) => (
          <button key={o.id} className="option" onClick={() => onResolve({ type: "reunion", optionId: o.id })}>
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}

function ReflectionBox({ id, onResolve }: { id: string; onResolve: (r: Resolution) => void }) {
  const r = REFLECTIONS.find((x) => x.id === id)!;
  const [text, setText] = useState("");
  return (
    <>
      <h2>Khoảnh khắc suy ngẫm</h2>
      <p className="q">{r.question}</p>
      <div className="options">
        {r.answers.map((a) => (
          <button key={a} className="option" onClick={() => onResolve({ type: "reflection", answer: a })}>
            {a}
          </button>
        ))}
      </div>
      <form
        className="freetext"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) onResolve({ type: "reflection", answer: text.trim() });
        }}
      >
        <input value={text} maxLength={120} placeholder="Hoặc tự viết (tối đa 120 ký tự)" onChange={(e) => setText(e.target.value)} />
        <button className="btn" disabled={!text.trim()}>
          Lưu
        </button>
      </form>
    </>
  );
}

function KidAsk({ state, id, childAge, onResolve }: { state: GameState; id: string; childAge: number; onResolve: (r: Resolution) => void }) {
  const r = KID_REQUEST_BY_ID[id];
  const memory = kidMemory(state, id);
  const short = state.fin.savings < r.price;
  return (
    <>
      <div className="kind-label">Con bạn {childAge} tuổi, năm {state.year}</div>
      <h2>Con xin {r.label}</h2>
      <p className="q">“{r.plea}”</p>
      <p className="famnote">
        Giá khoảng <strong>{formatMoney(r.price)}</strong>. Nhà bạn đang để dành {formatMoney(state.fin.savings)}
        {state.fin.debt > 0 && <>, còn nợ {formatMoney(state.fin.debt)}</>}
        {state.fin.income > 0 && <>, thu nhập của bạn khoảng {formatMoney(state.fin.income / 12)} mỗi tháng</>}.
        {short && " Mua bây giờ thì phải vay thêm."}
      </p>
      {memory && <p className="q"><em>{memory}</em></p>}
      <div className="options">
        <button className="option" onClick={() => onResolve({ type: "kidask", choice: "yes" })}>
          Đồng ý, mua cho con
        </button>
        <button className="option" onClick={() => onResolve({ type: "kidask", choice: "later" })}>
          Hẹn con sang năm
        </button>
        <button className="option" onClick={() => onResolve({ type: "kidask", choice: "explain" })}>
          Ngồi giải thích chuyện tiền nong trong nhà cho con
        </button>
      </div>
    </>
  );
}
