import Key from "../game/Key";
import Backspace from "../../assets/backspace.svg?react";

const COLORS = {
  correct: "bg-green-600",
  absent: "bg-gray-500",
  present: "bg-yellow-500",
  unread: "bg-unread",
};

export function Keyboard({ keyboardStatus, handleInput }) {
  const topRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const midRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const botRow = ["z", "x", "c", "v", "b", "n", "m"];

  return (
    <>
      <div className="flex gap-1">
        {topRow.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            bckgColor={COLORS[keyboardStatus[letter.charCodeAt(0) - 97]]}
            handleInput={handleInput}
          ></Key>
        ))}
      </div>
      <div className="flex gap-1">
        {midRow.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            bckgColor={COLORS[keyboardStatus[letter.charCodeAt(0) - 97]]}
            handleInput={handleInput}
          ></Key>
        ))}
      </div>
      <div className="flex gap-1">
        <Key
          letter="Enter"
          bckgColor={COLORS.unread}
          handleInput={handleInput}
        ></Key>
        {botRow.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            bckgColor={COLORS[keyboardStatus[letter.charCodeAt(0) - 97]]}
            handleInput={handleInput}
          ></Key>
        ))}
        <Key
          letter="Backspace"
          bckgColor={COLORS.unread}
          handleInput={handleInput}
          SymbolComponent={Backspace}
        ></Key>
      </div>
    </>
  );
}
