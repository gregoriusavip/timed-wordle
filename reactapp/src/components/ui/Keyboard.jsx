import Key from "../game/Key";
import Backspace from "../../assets/backspace.svg?react";
import { BsArrowRight } from "react-icons/bs";

const COLORS = {
  correct: "bg-green-600",
  absent: "bg-gray-500",
  present: "bg-yellow-500",
  unread: "bg-unread",
};

export default function Keyboard({ keyboardStatus, handleInput }) {
  const topRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const midRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const botRow = ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"];
  const keys = [topRow, midRow, botRow];

  const symbols = { Enter: BsArrowRight, Backspace: Backspace };

  return (
    <div>
      {keys.map((row, index) => (
        <div key={index} className="flex gap-1">
          {row.map((letter) => (
            <Key
              key={letter}
              letter={letter}
              bckgColor={
                COLORS[keyboardStatus[letter.charCodeAt(0) - 97]] ||
                COLORS["unread"]
              }
              handleInput={handleInput}
              SymbolComponent={symbols[letter]}
            ></Key>
          ))}
        </div>
      ))}
    </div>
  );
}
