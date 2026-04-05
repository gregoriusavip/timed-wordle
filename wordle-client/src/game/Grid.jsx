import "../App.css";
import Row from "./Row";

function Grid() {
  return (
    <div className="flex flex-col gap-2 w-[288px] sm:min-w-[288px] sm:w-1/3">
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
    </div>
  );
}

export default Grid;
