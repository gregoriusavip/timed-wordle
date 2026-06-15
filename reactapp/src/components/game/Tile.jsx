function Tile({ letter, bckgColor }) {
  const tileClasses = `
  w-10 h-10 
  flex items-center justify-center 
  text-xl font-bold uppercase 
  ${bckgColor}
`;

  return <div className={tileClasses}>{letter}</div>;
}

export default Tile;
