import {
  FaPencilAlt,
  FaEraser,
  FaUndo,
  FaRedo,
  FaTrash
} from "react-icons/fa";
import "../Whiteboard.css";

const Toolbar = ({ tool, setTool, undo, redo, clearCanvas }) => {
  return (
    <div className="toolbar">
      <button
        className={`tool-btn ${tool === "pencil" ? "active" : ""}`}
        onClick={() => setTool("pencil")}
      >
        <FaPencilAlt />
      </button>

      <button
        className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
        onClick={() => setTool("eraser")}
      >
        <FaEraser />
      </button>

      <div className="tool-separator" />

      <button className="tool-btn" onClick={undo}>
        <FaUndo />
      </button>

      <button className="tool-btn" onClick={redo}>
        <FaRedo />
      </button>

      <button className="tool-btn" onClick={clearCanvas}>
        <FaTrash />
      </button>
    </div>
  );
};

export default Toolbar;
