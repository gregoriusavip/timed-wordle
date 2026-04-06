import "../App.css";
import Row from "./Row";

function Grid() {
  return (
    <div className="flex flex-col gap-1.5 min-w-66.75 max-w-[320px]">
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
