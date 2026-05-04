import "../App.css";

function Tile({ letter, bckgColor }) {
  const tileClasses = `
  w-14 h-14 
  flex items-center justify-center 
  text-2xl font-bold uppercase 
  ${bckgColor}
`;

  return <div className={tileClasses}>{letter}</div>;
}

export default Tile;
