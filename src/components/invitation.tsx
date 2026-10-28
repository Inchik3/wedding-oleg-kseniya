import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  GOOGLE_APPS_SCRIPT_URL,
  attendanceOptions,
  couple,
  drinks,
  gallery,
  invitation,
  schedule,
  wedding,
  wishes,
  type Attendance,
  type ModalId,
} from "@/lib/wedding";

type Phase = "sealed" | "opening" | "open";

function useCountdown(targetIso: string) {
  const [parts, setParts] = useState({ days: "0", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setParts({
        days: String(Math.floor(diff / 86_400_000)),
        hours: String(Math.floor(diff / 3_600_000) % 24).padStart(2, "0"),
        minutes: String(Math.floor(diff / 60_000) % 60).padStart(2, "0"),
        seconds: String(Math.floor(diff / 1000) % 60).padStart(2, "0"),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return parts;
}

export function Invitation() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [modal, setModal] = useState<ModalId | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timer = useCountdown(wedding.countdownTarget);

  useEffect(() => {
    document.body.classList.toggle("scroll-lock", phase !== "open" || modal !== null || lightbox !== null);
  }, [phase, modal, lightbox]);

  useEffect(() => {
    if (modal || lightbox) closeRef.current?.focus();
  }, [modal, lightbox]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (lightbox) {
        setLightbox(null);
        return;
      }
      setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  async function playMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    try {
      await audio.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await playMusic();
    } else {
      audio.pause();
      setMusicOn(false);
    }
  }

  function openEnvelope() {
    if (phase !== "sealed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("opening");
    void playMusic();
    window.setTimeout(() => setPhase("open"), reduce ? 0 : 1200);
  }

  return (
    <div className="invite-root">
      <audio ref={audioRef} src="/wedding/music.mp3" loop preload="none" />

      <div className={musicOn ? "music-control is-on" : "music-control"}>
        <button type="button" className={musicOn ? "music-btn is-on" : "music-btn"} onClick={() => void toggleMusic()} aria-label={musicOn ? "Выключить музыку" : "Включить музыку"} aria-pressed={musicOn}>
          ♫
        </button>
        {phase === "open" && !musicOn ? <p className="music-hint">Нажмите, чтобы заиграла музыка</p> : null}
      </div>

      {phase === "open" ? (
        <nav className="nav" aria-label="Разделы приглашения">
          <button type="button" onClick={() => setModal("invite")}>Приглашение</button>
          <button type="button" onClick={() => document.getElementById("date")?.scrollIntoView({ behavior: "smooth" })}>Дата</button>
          <button type="button" onClick={() => setModal("program")}>Программа</button>
          <button type="button" onClick={() => setModal("wishes")}>Пожелания</button>
          <button type="button" onClick={() => setModal("rsvp")}>Анкета</button>
        </nav>
      ) : null}

      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="monogram">О <i>&</i> К</p>
          <h1>
            {couple.groom}
            <span>&</span>
            {couple.bride}
          </h1>
          <p className="date-line">{wedding.dateText}</p>
          <p className="hero-phrase">{wedding.phrase}</p>
          <a className="scroll-link" href="#date">Листайте вниз</a>
        </div>
      </header>

      <section className="countdown" aria-label="Обратный отсчёт">
        <img src="/wedding/countdown.jpg" alt="" />
        <div className="countdown-shade" />
        <div className="countdown-inner">
          <h2 className="countdown-names">
            {couple.groom}
            <span>&</span>
            {couple.bride}
          </h2>
          <p className="countdown-date">{wedding.dateText}</p>
          <p className="countdown-title">Осталось до свадьбы</p>
          <div className="timer">
            <div><b>{timer.days}</b><small>дней</small></div>
            <div className="timer-sep" />
            <div><b>{timer.hours}</b><small>часов</small></div>
            <div className="timer-sep" />
            <div><b>{timer.minutes}</b><small>минут</small></div>
            <div className="timer-sep" />
            <div><b>{timer.seconds}</b><small>секунд</small></div>
          </div>
        </div>
      </section>

      <section className="location" id="date">
        <img className="location-bg" src="/wedding/location.jpg" alt="" />
        <div className="location-shade" />
        <div className="location-card">
          <p className="kicker">Когда и где</p>
          <h2>17 июля<br />2027 года</h2>
          <div className="gold-rule" />
          <div className="location-item">
            <span>Место</span>
            <p>{wedding.venue}</p>
          </div>
          <div className="gold-rule" />
          <div className="location-item">
            <span>Адрес</span>
            <p>{wedding.city}</p>
          </div>
          <a className="map-btn" href={wedding.mapUrl} target="_blank" rel="noreferrer">Открыть карту</a>
        </div>
      </section>

      <section className="panel" id="blocks">
        <p className="kicker">Откройте блоки</p>
        <h2>Наша свадьба</h2>
        <p className="lead">Нажмите на карточку — подробности откроются во всплывающем окне.</p>
        <div className="cards">
          <button type="button" className="info-card" onClick={() => setModal("invite")}>
            <small>Письмо</small>
            <b>Приглашение</b>
            <span>Дорогие наши, будем рады видеть вас рядом</span>
          </button>
          <button type="button" className="info-card" onClick={() => setModal("program")}>
            <small>Расписание</small>
            <b>Программа дня</b>
            <span>ЗАГС, фотосессия, сбор гостей и банкет</span>
          </button>
          <button type="button" className="info-card" onClick={() => setModal("wishes")}>
            <small>Гостям</small>
            <b>Пожелания</b>
            <span>Несколько слов для вашего комфорта</span>
          </button>
          <button type="button" className="info-card" onClick={() => setModal("gallery")}>
            <small>Фото</small>
            <b>Наши моменты</b>
            <span>Галерея из нашей истории</span>
          </button>
          <button type="button" className="info-card info-card-wide" onClick={() => setModal("rsvp")}>
            <small>Анкета</small>
            <b>Анкета гостя</b>
            <span>Подтвердите присутствие и выберите напитки</span>
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <p className="monogram">О <i>&</i> К</p>
        <p>{wedding.dateNumeric}</p>
      </footer>

      {phase !== "open" ? (
        <div className={phase === "opening" ? "envelope is-opening" : "envelope"}>
          <button type="button" className="envelope-btn" onClick={openEnvelope} aria-label="Открыть приглашение">
            <span className="envelope-body" aria-hidden="true">
              <span className="envelope-paper" />
              <span className="letter">
                <strong>О <i>&</i> К</strong>
                <em>{wedding.dateEnvelope}</em>
              </span>
              <span className="pocket pocket-left" />
              <span className="pocket pocket-right" />
              <span className="pocket pocket-bottom" />
              <span className="flap" />
              <span className="seal">{couple.seal}</span>
            </span>
            <span className="envelope-caption">Нажмите, чтобы открыть приглашение</span>
          </button>
        </div>
      ) : null}

      {modal ? (
        <div className="modal" role="dialog" aria-modal="true">
          <button type="button" className="modal-backdrop" aria-label="Закрыть" onClick={() => setModal(null)} />
          <div className={modal === "gallery" ? "modal-card modal-card-wide" : "modal-card"}>
            <button ref={closeRef} type="button" className="modal-close" onClick={() => setModal(null)} aria-label="Закрыть">×</button>
            {modal === "invite" ? <InviteBody /> : null}
            {modal === "program" ? <ProgramBody /> : null}
            {modal === "wishes" ? <WishesBody /> : null}
            {modal === "gallery" ? <GalleryBody onOpen={setLightbox} /> : null}
            {modal === "rsvp" ? <RsvpBody /> : null}
          </div>
        </div>
      ) : null}

      {lightbox ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Фотография">
          <button ref={closeRef} type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Закрыть фото">×</button>
          <img src={lightbox} alt="Олег и Ксения" />
        </div>
      ) : null}
    </div>
  );
}

function InviteBody() {
  return (
    <>
      <p className="script-title">Дорогие наши!</p>
      {invitation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p className="signature">С любовью, {couple.groom} и {couple.bride}</p>
    </>
  );
}

function ProgramBody() {
  return (
    <>
      <p className="kicker">Программа дня</p>
      <h2>В этот день</h2>
      <div className="program-list">
        {schedule.map((item) => (
          <article className="program-item" key={item.time}>
            <time>{item.time}</time>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function WishesBody() {
  return (
    <>
      <p className="kicker">Наши пожелания для гостей</p>
      <h2>Для вашего комфорта</h2>
      <div className="wishes-list">
        {wishes.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </>
  );
}

function GalleryBody({ onOpen }: { onOpen: (src: string) => void }) {
  return (
    <>
      <p className="kicker">Галерея</p>
      <h2>Наши моменты</h2>
      <div className="gallery-grid">
        {gallery.map((photo) => (
          <button type="button" key={photo.src} onClick={() => onOpen(photo.src)}>
            <img src={photo.src} alt={photo.alt} />
          </button>
        ))}
      </div>
    </>
  );
}

function RsvpBody() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<"ok" | "err" | "">("");
  const [sending, setSending] = useState(false);

  function toggleDrink(value: string) {
    setSelected((prev) => {
      if (value === "none") return prev.includes("none") ? [] : ["none"];
      const next = prev.filter((item) => item !== "none" && item !== value);
      return prev.includes(value) ? next : [...next, value];
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Пожалуйста, укажите имя и фамилию.";
    if (!attendance) nextErrors.attendance = "Пожалуйста, выберите вариант ответа.";
    if (attendance === "attending" && selected.length === 0) {
      nextErrors.drinks = "Пожалуйста, выберите минимум один напиток или пункт «Не пью».";
    }
    setErrors(nextErrors);
    setStatus("");
    setStatusKind("");
    if (Object.keys(nextErrors).length > 0) return;

    const drinkLabels = drinks.filter((drink) => selected.includes(drink.value)).map((drink) => drink.label);
    const attendanceLabel = attendanceOptions.find((option) => option.value === attendance)?.label ?? "";
    const payload = {
      fullName: name.trim(),
      attendance: attendanceLabel,
      attendanceValue: attendance,
      drinks: attendance === "attending" ? drinkLabels : [],
      drinksText: attendance === "attending" ? drinkLabels.join(", ") : "",
      comment: comment.trim(),
      submittedAt: new Date().toISOString(),
    };

    if (!GOOGLE_APPS_SCRIPT_URL) {
      setStatusKind("err");
      setStatus("Ответ пока не отправлен: ссылка на Google-таблицу ещё не подключена.");
      return;
    }

    setSending(true);
    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setStatusKind("ok");
      setStatus(
        attendance === "attending"
          ? `${name.trim()}, спасибо! Будем рады видеть вас на празднике.`
          : "Спасибо, что сообщили нам.",
      );
      setName("");
      setAttendance("");
      setSelected([]);
      setComment("");
    } catch {
      setStatusKind("err");
      setStatus("Не получилось отправить ответ. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  }

  const showDrinks = attendance !== "declined";

  return (
    <>
      <p className="kicker">Анкета гостя</p>
      <h2>Подтвердите присутствие</h2>
      <p>Пожалуйста, сообщите заранее, сможете ли вы быть с нами, и какие напитки вам ближе.</p>
      <form className="rsvp-form" onSubmit={onSubmit} noValidate>
        <label className="field-label" htmlFor="guestName">Имя и фамилия</label>
        <input id="guestName" name="fullName" autoComplete="name" placeholder="Например: Иван Иванов" value={name} onChange={(event) => setName(event.target.value)} />
        {errors.name ? <p className="field-error">{errors.name}</p> : null}

        <fieldset>
          <legend className="field-label">Сможете ли присутствовать?</legend>
          <div className="choice-list">
            {attendanceOptions.map((option) => (
              <label className="choice" key={option.value}>
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  checked={attendance === option.value}
                  onChange={() => {
                    setAttendance(option.value);
                    if (option.value === "declined") setSelected([]);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errors.attendance ? <p className="field-error">{errors.attendance}</p> : null}
        </fieldset>

        {showDrinks ? (
          <fieldset>
            <legend className="field-label">Что предпочитаете из напитков?</legend>
            <p className="hint">Можно выбрать несколько вариантов</p>
            <div className="drink-grid">
              {drinks.map((drink) => (
                <label className="choice" key={drink.value}>
                  <input type="checkbox" name="drinks" value={drink.value} checked={selected.includes(drink.value)} onChange={() => toggleDrink(drink.value)} />
                  <span>{drink.label}</span>
                </label>
              ))}
            </div>
            {errors.drinks ? <p className="field-error">{errors.drinks}</p> : null}
          </fieldset>
        ) : null}

        <label className="field-label" htmlFor="guestComment">Комментарий</label>
        <textarea id="guestComment" name="comment" rows={4} placeholder="Комментарий или пожелание" value={comment} onChange={(event) => setComment(event.target.value)} />
        <button className="submit" type="submit" disabled={sending}>{sending ? "Отправляем…" : "Отправить"}</button>
        {status ? <p className={statusKind === "ok" ? "form-status is-ok" : "form-status is-err"} role="status">{status}</p> : null}
      </form>
    </>
  );
}
