import "../App.css";
import Row from "./Row";

function Grid({ guesses, currentGuess }) {
  const remainingGuess = 5 - guesses.length;
  return (
    <div className="flex flex-col gap-1.5 min-w-66.75 max-w-[320px]">
      {guesses.map((guess, index) => (
        <Row key={index} word={guess} />
      ))}
      {guesses.length < 6 && <Row word={currentGuess} />}
      {Array.from({ length: remainingGuess }).map((_, index) => (
        <Row key={`empty-${index}`} word="" />
      ))}
    </div>
  );
}

export default Grid;
