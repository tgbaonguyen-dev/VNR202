import { HOI_DO_BY_ID } from "../data/hoiDo";

export function HoiDoBox({ id }: { id?: string }) {
  if (!id) return null;
  const h = HOI_DO_BY_ID[id];
  if (!h) return null;
  return (
    <div className="hoido">
      <b>Hồi đó…</b>
      {h.text}
      <a href={h.url} target="_blank" rel="noreferrer">
        Nguồn: {h.source}
      </a>
    </div>
  );
}
