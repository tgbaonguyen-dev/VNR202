import type { Card, GameState } from "../types";
import { HOI_DO_BY_ID } from "../data/hoiDo";
import { ITEM_BY_ID, RARITY_LABEL } from "../data/items";
import { ItemSlot } from "./ItemSlot";

const ORDER: Record<Card["kind"], number> = { history: 0, choice: 1, item: 2, money: 3, life: 4, echo: 5, friend: 6, thought: 7, scene: 8 };

export function LifeLog({ s }: { s: GameState }) {
  const cards = [...s.feed].sort((a, b) => b.year - a.year || ORDER[a.kind] - ORDER[b.kind]);
  return (
    <section className="panel log">
      <div className="panel-head">
        <h3>Ghi chép cuộc đời</h3>
        <span className="mono muted">Mới nhất trước</span>
      </div>
      <ol className="log-list" aria-live="polite">
        {cards.map((c) => (
          <LogRow key={c.id} c={c} isNew={c.year === s.year} />
        ))}
      </ol>
    </section>
  );
}

function DataLine({ id }: { id?: string }) {
  if (!id) return null;
  const h = HOI_DO_BY_ID[id];
  if (!h) return null;
  return (
    <div className="dataline">
      <b>Hồi đó</b> {h.text}{" "}
      <a href={h.url} target="_blank" rel="noreferrer">
        ({h.source})
      </a>
    </div>
  );
}

function LogRow({ c, isNew }: { c: Card; isNew: boolean }) {
  const cls = `log-row k-${c.kind}${c.down ? " down" : ""}${isNew ? " new" : ""}${c.big ? " big" : ""}`;
  return (
    <li className={cls}>
      <span className="age mono">{c.age ?? c.year - 1985} tuổi</span>
      <div className="log-body">
        {c.kind === "history" && <div className="label">Đất nước, năm {c.year}</div>}
        {c.kind === "echo" && <div className="label">Nhớ lại</div>}
        {c.kind === "friend" && <div className="label">Bạn cũ</div>}
        {c.kind === "thought" && <div className="label">Suy nghĩ của bạn</div>}
        {c.kind === "scene" && <div className="label">Làng năm ấy</div>}
        {c.kind === "item" && c.itemId ? (
          <div className="log-item">
            <ItemSlot id={c.itemId} small />
            <div>
              <div className="label">Kỷ vật mới</div>
              <strong>{c.text}</strong>{" "}
              <span className={`rarity ${ITEM_BY_ID[c.itemId].rarity}`}>({RARITY_LABEL[ITEM_BY_ID[c.itemId].rarity]})</span>
              <div>{c.sub}</div>
            </div>
          </div>
        ) : (
          <div className="text">
            {c.text}
            {c.tag && <span className={`tag ${c.tag}`}>{c.tag === "doimoi" ? "Nhờ Đổi mới" : "Nhờ lựa chọn của bạn"}</span>}
          </div>
        )}
        {c.kind !== "item" && c.sub && <div className="sub">{c.sub}</div>}
        {c.kind === "history" && c.source && (
          <div className="dataline">
            <b>Nguồn</b>{" "}
            {c.url ? (
              <a href={c.url} target="_blank" rel="noreferrer">
                {c.source}
              </a>
            ) : (
              c.source
            )}
          </div>
        )}
        <DataLine id={c.hoiDoId} />
      </div>
    </li>
  );
}
