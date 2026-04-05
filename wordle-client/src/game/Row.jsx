import Tile from "./Tile";
import "../App.css";

function Row() {
  return (
    <div className="flex gap-2">
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
    </div>
  );
}

export default Row;
