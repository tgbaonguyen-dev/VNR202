import { useCallback, useEffect, useMemo, useState } from "react";
import { CONFIG_LIMITS, DEFAULT_CONFIG, QUESTION_LIMITS, validateQuestion } from "../../engine/catchConfig";
import type { CustomQuestion, GameConfig } from "../../engine/catchConfig";
import { ClassRoom } from "../catch/ClassRoom";

// Trang quản trị chế độ "Hứng đáp án": sửa cấu hình, soạn câu hỏi, xem phòng.
// Vào bằng <địa chỉ>/#admin. Mật khẩu đặt bằng biến môi trường ADMIN_PASSWORD trên máy chủ.

const KEY = "vnr202-admin";
const COLS: (keyof CustomQuestion)[] = ["id", "cau_hoi", "dung", "sai_1", "sai_2", "giai_thich", "nguon", "url", "do_kho"];
const COL_LABEL: Record<string, string> = {
  id: "Mã",
  cau_hoi: "Câu hỏi",
  dung: "Đáp án đúng",
  sai_1: "Sai 1",
  sai_2: "Sai 2",
  giai_thich: "Giải thích",
  nguon: "Nguồn",
  url: "Link",
  do_kho: "Độ khó",
};

async function call<T>(path: string, key: string, init?: RequestInit): Promise<{ status: number; data: T }> {
  const res = await fetch(path, { ...init, headers: { "content-type": "application/json", "x-admin-key": key, ...(init?.headers ?? {}) } });
  return { status: res.status, data: (await res.json().catch(() => ({}))) as T };
}

// ---------------------------------------------------------------- CSV

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  const t = text.replace(/^﻿/, "");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"' && t[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

function csvToQuestions(text: string): CustomQuestion[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (k: string) => head.indexOf(k);
  return rows.slice(1).map((r, i) => {
    const get = (k: string) => (idx(k) >= 0 ? (r[idx(k)] ?? "").trim() : "");
    const dk = get("do_kho");
    return {
      id: get("id") || `q${i + 1}`,
      cau_hoi: get("cau_hoi"),
      dung: get("dung"),
      sai_1: get("sai_1"),
      sai_2: get("sai_2"),
      giai_thich: get("giai_thich"),
      nguon: get("nguon"),
      url: get("url") || undefined,
      do_kho: dk === "de" || dk === "kho" ? dk : "vua",
    };
  });
}

function questionsToCsv(qs: CustomQuestion[]): string {
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [COLS.join(","), ...qs.map((q) => COLS.map((c) => esc(q[c])).join(","))].join("\n");
}

// ---------------------------------------------------------------- trang

export function Admin({ onExit }: { onExit: () => void }) {
  const [key, setKey] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"config" | "questions" | "rooms">("config");
  const [hosting, setHosting] = useState<{ code: string | undefined } | null>(null);

  const login = useCallback(async (password: string) => {
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) }).catch(() => null);
    if (res?.ok) {
      setKey(password);
      setAuthed(true);
      setErr("");
      try {
        sessionStorage.setItem(KEY, password);
      } catch {
        /* bỏ qua */
      }
    } else setErr(res ? "Sai mật khẩu." : "Không kết nối được máy chủ.");
  }, []);

  useEffect(() => {
    if (key && !authed) void login(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <main className="admin">
        <form
          className="admin-card admin-login"
          onSubmit={(e) => {
            e.preventDefault();
            void login(pw);
          }}
        >
          <h1>Quản trị Gặt Dấu Đổi Mới</h1>
          <label>
            Mật khẩu
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus autoComplete="current-password" />
          </label>
          <button className="btn primary" type="submit" disabled={!pw}>
            Đăng nhập
          </button>
          {err && <p className="admin-err">{err}</p>}
          <p className="admin-note">Mật khẩu đặt bằng biến môi trường ADMIN_PASSWORD trên máy chủ. Không đặt thì máy chủ in mật khẩu tạm ra log khi khởi động.</p>
          <button type="button" className="btn ghost" onClick={onExit}>
            Về trang đầu
          </button>
        </form>
      </main>
    );
  }

  if (hosting) {
    return <ClassRoom initialCode={hosting.code} mode="host" adminKey={key} onExit={() => setHosting(null)} />;
  }

  return (
    <main className="admin">
      <header className="admin-top">
        <h1>Quản trị Gặt Dấu Đổi Mới</h1>
        <nav className="admin-tabs" role="tablist">
          {(
            [
              ["config", "Cấu hình"],
              ["questions", "Câu hỏi"],
              ["rooms", "Phòng"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={`btn${tab === k ? " primary" : ""}`} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-head-actions">
          <button className="btn primary" onClick={() => setHosting({ code: undefined })}>
            Mở màn hình chiếu
          </button>
          <button
            className="btn ghost"
            onClick={() => {
              try {
                sessionStorage.removeItem(KEY);
              } catch {
                /* bỏ qua */
              }
              onExit();
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>
      {tab === "config" && <ConfigTab adminKey={key} />}
      {tab === "questions" && <QuestionsTab adminKey={key} />}
      {tab === "rooms" && <RoomsTab adminKey={key} onHost={(code) => setHosting({ code })} />}
    </main>
  );
}

function ConfigTab({ adminKey }: { adminKey: string }) {
  const [cfg, setCfg] = useState<GameConfig | null>(null);
  const [saved, setSaved] = useState<GameConfig | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void call<{ config: GameConfig }>("/api/admin/config", adminKey).then(({ data }) => {
      setCfg(data.config);
      setSaved(data.config);
    });
  }, [adminKey]);

  const groups = useMemo(() => {
    const g: Record<string, (keyof GameConfig)[]> = {};
    for (const k of Object.keys(CONFIG_LIMITS) as (keyof GameConfig)[]) (g[CONFIG_LIMITS[k].group] ??= []).push(k);
    return g;
  }, []);

  if (!cfg) return <p className="admin-card">Đang tải…</p>;
  const dirty = JSON.stringify(cfg) !== JSON.stringify(saved);

  const save = async () => {
    const { status, data } = await call<{ config: GameConfig }>("/api/admin/config", adminKey, { method: "PUT", body: JSON.stringify(cfg) });
    if (status === 200) {
      setCfg(data.config);
      setSaved(data.config);
      setMsg("Đã lưu. Áp dụng cho các phòng bấm Bắt đầu từ giờ.");
    } else setMsg("Lưu không được.");
  };

  return (
    <section className="admin-card">
      <p className="admin-note">Mỗi phòng dùng cấu hình tại lúc bấm Bắt đầu. Sửa ở đây không ảnh hưởng phòng đang chơi.</p>
      <div className="cfg-groups">
        {Object.entries(groups).map(([g, keys]) => (
          <fieldset key={g} className="cfg-group">
            <legend>{g}</legend>
            {keys.map((k) => {
              const lim = CONFIG_LIMITS[k];
              const v = cfg[k];
              const changed = v !== DEFAULT_CONFIG[k];
              return (
                <label key={k} className={`cfg-row${changed ? " changed" : ""}`}>
                  <span>
                    {lim.label}
                    {changed && <small> (mặc định {String(DEFAULT_CONFIG[k])})</small>}
                  </span>
                  {typeof v === "boolean" ? (
                    <input type="checkbox" checked={v} onChange={(e) => setCfg({ ...cfg, [k]: e.target.checked })} />
                  ) : (
                    <input type="number" min={lim.min} max={lim.max} step={lim.step} value={v} onChange={(e) => setCfg({ ...cfg, [k]: Number(e.target.value) })} />
                  )}
                </label>
              );
            })}
          </fieldset>
        ))}
      </div>
      <div className="admin-actions">
        <button className="btn primary" disabled={!dirty} onClick={() => void save()}>
          Lưu cấu hình
        </button>
        <button className="btn" onClick={() => setCfg({ ...DEFAULT_CONFIG })}>
          Về mặc định
        </button>
        <button className="btn ghost" disabled={!dirty} onClick={() => setCfg(saved)}>
          Bỏ thay đổi
        </button>
        {msg && <span className="admin-msg">{msg}</span>}
      </div>
    </section>
  );
}

function QuestionsTab({ adminKey }: { adminKey: string }) {
  const [qs, setQs] = useState<CustomQuestion[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void call<{ questions: CustomQuestion[] }>("/api/admin/questions", adminKey).then(({ data }) => setQs(data.questions ?? []));
  }, [adminKey]);

  if (!qs) return <p className="admin-card">Đang tải…</p>;

  const set = (i: number, k: keyof CustomQuestion, v: string) => setQs(qs.map((q, j) => (j === i ? { ...q, [k]: v } : q)));
  const add = () => setQs([...qs, { id: `q${qs.length + 1}`, cau_hoi: "", dung: "", sai_1: "", sai_2: "", giai_thich: "", nguon: "", do_kho: "vua" }]);

  const save = async () => {
    const { status, data } = await call<{ questions?: CustomQuestion[]; errors?: string[] }>("/api/admin/questions", adminKey, { method: "PUT", body: JSON.stringify(qs) });
    if (status === 200) {
      setErrors([]);
      setQs(data.questions ?? qs);
      setMsg(`Đã lưu ${data.questions?.length ?? qs.length} câu.`);
    } else {
      setErrors(data.errors ?? ["Lưu không được."]);
      setMsg("");
    }
  };

  const importFile = async (file: File) => {
    const text = await file.text();
    const list = csvToQuestions(text);
    setQs(list);
    setMsg(`Đã nạp ${list.length} câu từ ${file.name}. Bấm Lưu để áp dụng.`);
  };

  const exportCsv = () => {
    const blob = new Blob(["﻿" + questionsToCsv(qs)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cau-hoi.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="admin-card">
      <p className="admin-note">
        Cần ít nhất 3 câu và bật "Dùng câu hỏi nhóm soạn" trong Cấu hình. Không đủ thì game tự sinh câu hỏi từ mốc lịch sử. Mỗi câu phải có nguồn. Câu hỏi tối đa {QUESTION_LIMITS.prompt} ký tự, đáp án {QUESTION_LIMITS.answer} ký tự.
      </p>
      <div className="admin-actions">
        <button className="btn" onClick={add}>
          Thêm câu
        </button>
        <label className="btn">
          Nhập CSV
          <input type="file" accept=".csv,text/csv" hidden onChange={(e) => e.target.files?.[0] && void importFile(e.target.files[0])} />
        </label>
        <button className="btn" onClick={exportCsv} disabled={qs.length === 0}>
          Xuất CSV
        </button>
        <button className="btn primary" onClick={() => void save()}>
          Lưu {qs.length} câu
        </button>
        {msg && <span className="admin-msg">{msg}</span>}
      </div>
      {errors.length > 0 && (
        <ul className="admin-errs">
          {errors.slice(0, 30).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <div className="q-table-wrap">
        <table className="q-table">
          <thead>
            <tr>
              <th>#</th>
              {COLS.map((c) => (
                <th key={c}>{COL_LABEL[c]}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {qs.map((q, i) => {
              const bad = validateQuestion(q);
              return (
                <tr key={i} className={bad.length ? "bad" : ""} title={bad.join(", ")}>
                  <td>{i + 1}</td>
                  {COLS.map((c) => (
                    <td key={c}>
                      {c === "do_kho" ? (
                        <select value={q.do_kho ?? "vua"} onChange={(e) => set(i, c, e.target.value)} aria-label={`Độ khó câu ${i + 1}`}>
                          <option value="de">Dễ</option>
                          <option value="vua">Vừa</option>
                          <option value="kho">Khó</option>
                        </select>
                      ) : (
                        <textarea value={String(q[c] ?? "")} rows={c === "cau_hoi" || c === "giai_thich" ? 2 : 1} onChange={(e) => set(i, c, e.target.value)} aria-label={`${COL_LABEL[c]} câu ${i + 1}`} />
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="btn ghost" onClick={() => setQs(qs.filter((_, j) => j !== i))} aria-label={`Xóa câu ${i + 1}`}>
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RoomsTab({ adminKey, onHost }: { adminKey: string; onHost: (code: string) => void }) {
  const [rooms, setRooms] = useState<{ code: string; phase: string; players: number; startedAt: number }[] | null>(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(() => {
    void call<{ rooms: typeof rooms }>("/api/admin/rooms", adminKey).then(({ data }) => setRooms(data.rooms ?? []));
  }, [adminKey]);
  useEffect(() => {
    load();
    const t = window.setInterval(load, 5000);
    return () => window.clearInterval(t);
  }, [load]);
  if (!rooms) return <p className="admin-card">Đang tải…</p>;
  const label: Record<string, string> = { lobby: "Đang chờ", playing: "Đang chơi", ended: "Đã kết thúc" };
  const remove = async (code: string) => {
    if (!window.confirm(`Xóa phòng ${code}? Người đang ở trong phòng sẽ bị ngắt kết nối.`)) return;
    const { status } = await call<{ ok?: boolean; error?: string }>(`/api/admin/rooms/${code}`, adminKey, { method: "DELETE" });
    if (status === 200) {
      setMsg(`Đã xóa phòng ${code}.`);
      load();
    } else setMsg(`Không thể xóa phòng ${code}.`);
  };
  return (
    <section className="admin-card">
      <p className="admin-note">Tự cập nhật mỗi 5 giây. Phòng quá 3 giờ tự xóa.</p>
      {msg && <p className="admin-msg" role="status">{msg}</p>}
      {rooms.length === 0 ? (
        <p>Chưa có phòng nào.</p>
      ) : (
        <table className="q-table rooms">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Trạng thái</th>
              <th>Người chơi</th>
              <th>Bắt đầu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.code}>
                <td>{r.code}</td>
                <td>{label[r.phase] ?? r.phase}</td>
                <td>{r.players}</td>
                <td>{r.startedAt ? new Date(r.startedAt).toLocaleTimeString("vi-VN") : "–"}</td>
                <td>
                  <div className="row">
                    <button className="btn" onClick={() => onHost(r.code)}>Vào lại</button>
                    <button className="btn ghost" onClick={() => void remove(r.code)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
