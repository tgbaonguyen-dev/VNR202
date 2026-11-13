import type { GameState } from "../types";
import { PURCHASES } from "../data/turningPoints";
import { boughtThisYear, canBuy } from "../engine/engine";
import { formatMoney } from "../engine/life";

interface Props {
  s: GameState;
  onBuy: (id: string) => void;
  onBank: (banked: boolean) => void;
  onClose: () => void;
}

export function SpendDialog({ s, onBuy, onBank, onClose }: Props) {
  const list = PURCHASES.filter((p) => p.available(s));
  const once = list.filter((p) => !p.repeatable);
  const yearly = list.filter((p) => p.repeatable);
  const row = (p: (typeof PURCHASES)[number]) => {
    const need = p.price * p.downPayment;
    const ok = canBuy(s, p.id);
    const done = p.repeatable && boughtThisYear(s, p.id);
    return (
      <button key={p.id} className="option" disabled={!ok} onClick={() => onBuy(p.id)}>
        {p.label}, khoảng {formatMoney(p.price)}
        <span className="lock">
          {p.desc}
          {done && " Năm nay bạn đã làm rồi."}
          {!ok && !done && ` Cần có sẵn ${formatMoney(need)}.`}
          {ok && p.downPayment < 1 && s.fin.savings < p.price && ` Sẽ vay khoảng ${formatMoney(p.price - Math.min(s.fin.savings, p.price))}.`}
        </span>
      </button>
    );
  };
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Chi tiêu, đầu tư</h2>
          <button className="btn ghost" onClick={onClose} autoFocus>
            Đóng
          </button>
        </div>
        <p className="q">
          Tiết kiệm hiện có: <strong>{formatMoney(s.fin.savings)}</strong>
          {s.fin.debt > 0 && (
            <>
              {" "}
              Đang nợ: <strong>{formatMoney(s.fin.debt)}</strong>
            </>
          )}
        </p>

        {s.year >= 2000 && (
          <div className="savemode" role="group" aria-label="Cách giữ tiền">
            <button className="chip" aria-pressed={!s.fin.banked} onClick={() => onBank(false)}>
              Giữ tiền mặt ở nhà
            </button>
            <button className="chip" aria-pressed={s.fin.banked} onClick={() => onBank(true)}>
              Gửi tiết kiệm ngân hàng
            </button>
            <span className="tiny muted">Gửi tiết kiệm: tiền tăng thêm khoảng 2% mỗi năm sau trượt giá (minh họa).</span>
          </div>
        )}

        {once.length > 0 && <h3 className="sec">Mua sắm lớn</h3>}
        <div className="options">{once.map(row)}</div>
        {yearly.length > 0 && <h3 className="sec">Mỗi năm một lần</h3>}
        <div className="options">{yearly.map(row)}</div>
        {list.length === 0 && <p>Hiện chưa có khoản nào để chi. Các khoản mới sẽ mở ra theo thời gian.</p>}
        <p className="tiny muted" style={{ marginTop: 12 }}>
          Giá quy theo giá năm 2025, là ước lượng minh họa. Chi tiêu không làm dừng thời gian khi đóng hộp này.
        </p>
      </div>
    </div>
  );
}
