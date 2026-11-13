import { useState } from "react";
import { ITEM_BY_ID } from "../data/items";

/** Ô kỷ vật có khung theo độ hiếm. Ảnh: public/images/items/<id>.png */
export function ItemSlot({ id, unknown = false, small = false }: { id: string; unknown?: boolean; small?: boolean }) {
  const item = ITEM_BY_ID[id];
  const [imgOk, setImgOk] = useState(true);
  if (unknown) {
    return (
      <div className="slot unknown" aria-label="Kỷ vật chưa có">
        ?
      </div>
    );
  }
  return (
    <div className={`slot ${item.rarity}${small ? " small" : ""}`} aria-label={item.name}>
      {imgOk ? (
        <img src={`/images/items/${id}.png`} alt="" onError={() => setImgOk(false)} />
      ) : (
        <Placeholder name={item.name} />
      )}
    </div>
  );
}

/** Hình giữ chỗ khi chưa có ảnh: chữ cái đầu trong con dấu tròn */
function Placeholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="26" fill="#f3e9d2" stroke="#2b2118" strokeWidth="3" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#2b2118" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="32" y="39" textAnchor="middle" fontFamily="Be Vietnam Pro, sans-serif" fontWeight="800" fontSize="18" fill="#2b2118">
        {initials}
      </text>
    </svg>
  );
}
