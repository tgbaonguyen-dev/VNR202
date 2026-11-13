import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { GameState } from "../types";
import { DISCUSSION_QUESTION } from "../config";
import { CHERISH } from "../data/people";
import { ITEM_BY_ID, RARITY_LABEL } from "../data/items";
import { HOI_DO_BY_ID } from "../data/hoiDo";
import { FAMILY_NAME, lifePath, maxScore, scoreCode, storyLines, strengthOf, topItems, totalScore } from "../engine/engine";
import { careerTitle, education, occupation } from "../engine/life";
import { LifeMap, Trajectory } from "./Panels";
import { ItemSlot } from "./ItemSlot";

export function EndCard({ state, onCherish, onReplay }: { state: GameState; onCherish: (c: string) => void; onReplay: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const lines = storyLines(state);
  // Lấy ba mẩu trải đều cả cuộc đời: đầu, giữa, cuối
  const seen = state.seenHoiDo;
  const picks = seen.length <= 3 ? seen : [seen[0], seen[Math.floor(seen.length / 2)], seen[seen.length - 1]];
  const facts = picks.map((id) => HOI_DO_BY_ID[id]);
  const quote = state.reflections.r40;

  async function save() {
    if (!ref.current) return;
    setSaving(true);
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `the-cuoc-doi-${state.nickname}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="endwrap">
      {!state.cherish && (
        <div className="lifecard" style={{ boxShadow: "none" }}>
          <h2>Năm 2025, bạn 40 tuổi</h2>
          <p className="lead">Điều bạn trân trọng nhất là gì?</p>
          <div className="row">
            {CHERISH.map((c) => (
              <button key={c} className="btn" onClick={() => onCherish(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {maxScore(state) > 0 && (
        <div className="lifecard scorecard" style={{ boxShadow: "none" }}>
          <div className="kind-label">Điểm các lượt tự chơi</div>
          <p className="mg-score">
            <strong>{totalScore(state)}</strong>/{maxScore(state)} điểm · Mã xác nhận <span className="mono">{scoreCode(state)}</span>
          </p>
          <p className="tiny muted">Điểm chỉ tính từ các lượt tự chơi, không tính tiền hay chỉ số cuộc đời. Đưa mã này cho nhóm khi nhận quà.</p>
        </div>
      )}

      <div className="lifecard" ref={ref}>
        <h2>Một đời của {state.nickname}</h2>
        <p className="lead">
          Từ 1985 đến 2025. {FAMILY_NAME(state)}.
          {state.cherish ? ` Trân trọng nhất: ${state.cherish}.` : ""}
        </p>

        <p className="lead">
          {occupation(state).job}, {careerTitle(state).toLowerCase()}. Học vấn: {education(state).toLowerCase()}.
        </p>
        <div className="lc-grid" style={{ marginBottom: 18 }}>
          <div className="lc-block">
            <h3>Quỹ đạo cuộc đời</h3>
            <Trajectory s={state} />
          </div>
          <LifeMap s={state} compact />
        </div>

        <div className="lc-grid">
          <div className="lc-block">
            <h3>Kỷ vật quý nhất</h3>
            <div className="lc-items">
              {topItems(state).map((id) => (
                <figure key={id}>
                  <ItemSlot id={id} />
                  <span>
                    {ITEM_BY_ID[id].name}
                    <br />
                    <span className={`rarity ${ITEM_BY_ID[id].rarity}`}>{RARITY_LABEL[ITEM_BY_ID[id].rarity]}</span>
                  </span>
                </figure>
              ))}
            </div>
          </div>
          <div className="lc-block">
            <h3>Điểm mạnh nổi bật</h3>
            <div className="strength">{strengthOf(state)}</div>
            {quote && <p className="quote">&ldquo;{quote}&rdquo;</p>}
          </div>
          <div className="lc-block">
            <h3>Những lựa chọn làm nên đời bạn</h3>
            <ul>
              {lifePath(state).slice(0, 7).map((l) => (
                <li key={l}>{l}.</li>
              ))}
            </ul>
          </div>
          <div className="lc-block">
            <h3>Ba điều về thời đại bạn đã sống</h3>
            <ul>
              {facts.map((h) => (
                <li key={h.id}>{h.text}</li>
              ))}
            </ul>
          </div>
          <div className="lc-block">
            <h3>Con đường của {state.friend.name}</h3>
            <ul>{lines.friend.length ? lines.friend.map((l) => <li key={l}>{l}.</li>) : <li>{state.friend.name} gắn bó với làng.</li>}</ul>
          </div>
        </div>

        <div className="discussion">{DISCUSSION_QUESTION}</div>
      </div>

      <div className="row">
        <button className="btn primary" onClick={save} disabled={saving}>
          {saving ? "Đang lưu ảnh…" : "Lưu tấm thẻ thành ảnh"}
        </button>
        <button className="btn" onClick={onReplay}>
          Sống một đời khác
        </button>
      </div>
    </div>
  );
}
