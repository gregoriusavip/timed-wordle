import "../App.css";
import Row from "./Row";

function Grid({ attempts, currentGuess, currentResult }) {
  const remainingGuess = 5 - attempts.length;
  return (
    <div className="flex flex-col gap-1.5 min-w-66.75 max-w-[320px]">
      {attempts.map((attempt, index) => (
        <Row key={index} word={attempt[0]} result={attempt[1]} />
      ))}
      {attempts.length < 6 && (
        <Row key={attempts.length} word={currentGuess} result={currentResult} />
      )}
      {Array.from({ length: remainingGuess }).map((_, index) => (
        <Row key={attempts.length + index + 1} />
      ))}
    </div>
  );
}

export default Grid;
