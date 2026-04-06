import Tile from "./Tile";
import "../App.css";

function Row({ word = "" }) {
  const paddedWord = word.padEnd(5, " ");
  const letters = paddedWord.split("");

  return (
    <div className="flex gap-1.5">
      {letters.map((char, index) => (
        <Tile key={index} letter={char} />
      ))}
    </div>
  );
}

export default Row;
