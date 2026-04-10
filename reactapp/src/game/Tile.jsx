import "../App.css";

function Tile({ letter }) {
  return (
    <div className="w-1/2 aspect-square bg-zinc-400 shadow-amber-200">
      {letter}
    </div>
  );
}

export default Tile;
