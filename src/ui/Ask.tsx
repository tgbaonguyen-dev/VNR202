import type { GameState } from "../types";
import { openRequests, requestState } from "../engine/engine";
import { formatMoney } from "../engine/life";

interface Props {
  s: GameState;
  onAsk: (id: string) => void;
  onClose: () => void;
}

const STATE_TEXT: Record<string, string> = {
  got: "Bạn đã có rồi.",
  promised: "Bố mẹ đã hẹn sang năm.",
  asked: "Năm nay bạn đã xin một lần rồi.",
};

export function AskDialog({ s, onAsk, onClose }: Props) {
  const list = openRequests(s);
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Xin bố mẹ</h2>
          <button className="btn ghost" onClick={onClose} autoFocus>
            Đóng
          </button>
        </div>
        <p className="q">
          Bạn chưa tự kiếm tiền. Muốn gì cũng phải xin bố mẹ. Nhà bạn đang để dành khoảng{" "}
          <strong>{formatMoney(s.fin.famSavings)}</strong>
          {s.fin.famDebt > 0 && <>, còn nợ {formatMoney(s.fin.famDebt)}</>}. Mỗi năm chỉ xin một lần, bố mẹ quyết theo tiền nhà.
        </p>
        <div className="options">
          {list.map((r) => {
            const st = requestState(s, r.id);
            return (
              <button key={r.id} className="option" disabled={st !== "open"} onClick={() => onAsk(r.id)}>
                {r.label}, khoảng {formatMoney(r.price)}
                <span className="lock">
                  {r.desc} {STATE_TEXT[st] ?? ""}
                </span>
              </button>
            );
          })}
        </div>
        {list.length === 0 && <p>Bạn còn nhỏ, chưa biết xin gì. Lớn thêm chút nữa nhé.</p>}
        <p className="tiny muted" style={{ marginTop: 12 }}>
          Giá quy theo giá năm 2025, là ước lượng minh họa. Thời gian vẫn trôi khi hộp này mở.
        </p>
      </div>
    </div>
  );
}
