import Tile from "./Tile";
import "../App.css";

const COLORS = {
  correct: "bg-green-600",
  absent: "bg-gray-500",
  present: "bg-yellow-500",
};

function Row({ word = "", result = null }) {
  const paddedWord = word.padEnd(5, " ");
  const letters = paddedWord.split("");

  return (
    <div className="flex gap-1.5">
      {letters.map((char, index) => (
        <Tile
          key={index}
          letter={char}
          bckgColor={
            result !== null ? COLORS[result[index].status] : "bg-gray-500"
          }
        />
      ))}
    </div>
  );
}

export default Row;
