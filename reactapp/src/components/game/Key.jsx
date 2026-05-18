function Key({ letter, bckgColor, handleInput, SymbolComponent = null }) {
  const tileClasses = `
  w-14 h-14 
  flex items-center justify-center 
  text-2xl font-bold uppercase 
  ${bckgColor}`;

  return (
    <button className={tileClasses} onClick={() => handleInput(letter)}>
      {SymbolComponent ? <SymbolComponent /> : letter}
    </button>
  );
}

export default Key;
