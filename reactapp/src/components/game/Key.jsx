function Key({ letter, bckgColor, handleInput, SymbolComponent = null }) {
  const container = `
  w-8 h-9
  flex items-center justify-center 
  ${bckgColor}`;
  const text = "text-sm font-bold uppercase";
  const border = "rounded-md shadow-md";

  return (
    <button
      className={`${container} ${text} ${border}`}
      onClick={(e) => handleInput(e, letter)}
    >
      {SymbolComponent ? <SymbolComponent /> : letter}
    </button>
  );
}

export default Key;
