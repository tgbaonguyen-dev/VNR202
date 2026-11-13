import { useState } from "react";
import type { GameState } from "../types";
import { ITEMS, RARITY_LABEL } from "../data/items";
import { HoiDoBox } from "./HoiDoBox";
import { ItemSlot } from "./ItemSlot";

export function Bag({ state, onClose }: { state: GameState; onClose: () => void }) {
  const [tab, setTab] = useState<"items" | "notes">("items");
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dialog wide" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2>Túi kỷ vật</h2>
          <button className="btn ghost" onClick={onClose} autoFocus>
            Đóng
          </button>
        </div>
        <div className="tabs" role="tablist">
          <button className="chip" role="tab" aria-pressed={tab === "items"} onClick={() => setTab("items")}>
            Kỷ vật ({state.items.length}/{ITEMS.length})
          </button>
          <button className="chip" role="tab" aria-pressed={tab === "notes"} onClick={() => setTab("notes")}>
            Sổ tay thời đại ({state.seenHoiDo.length})
          </button>
        </div>
        {tab === "items" ? (
          <div className="grid">
            {ITEMS.map((it) => {
              const owned = state.items.includes(it.id);
              return (
                <figure key={it.id} title={owned ? it.context : "Chưa có"}>
                  <ItemSlot id={it.id} unknown={!owned} />
                  <figcaption>
                    {owned ? it.name : "Chưa có"}
                    <br />
                    <span className={`rarity ${it.rarity}`}>{RARITY_LABEL[it.rarity]}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ) : (
          <div className="notebook">
            {state.seenHoiDo.length === 0 && <p>Bạn chưa gặp mẩu "Hồi đó…" nào. Sống tiếp để mở sổ tay.</p>}
            {state.seenHoiDo.map((id) => (
              <HoiDoBox key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
