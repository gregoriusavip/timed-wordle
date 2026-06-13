import { useEffect, useRef } from "react";

export default function Timer({ minutes, seconds }) {
  const border = "shrink-0 grow-0 rounded-full border-5 border-transparent";
  const container = "flex items-center justify-center w-11 h-11";
  const totalTime = minutes * 60 + seconds;
  const borderRef = useRef(null);
  useEffect(() => {
    const el = borderRef.current;
    if (!el) return;

    el.classList.remove(
      "animate-timer-blink-green",
      "animate-timer-blink-yellow",
      "animate-timer-blink-red",
    );
    void el.offsetWidth;
    if (totalTime > 10) {
      el.classList.add("animate-timer-blink-green");
    } else if (totalTime > 5) {
      el.classList.add("animate-timer-blink-yellow");
    } else if (totalTime > 0) {
      el.classList.add("animate-timer-blink-red");
    }
  }, [totalTime]);
  return (
    <div ref={borderRef} className={`${border} ${container}`}>
      <span>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
}
