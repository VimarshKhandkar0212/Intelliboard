import "../Whiteboard.css";

const RightPanel = () => {
  return (
    <div className="right-panel">
      <div className="right-panel-section">
        ✍️ Handwritten → Text
      </div>

      <div className="right-panel-section">
        🧠 Slide Summary
      </div>

      <div className="right-panel-section">
        🖼️ Image AI
      </div>

      <div className="right-panel-section">
        📄 Export to PDF
      </div>
    </div>
  );
};

export default RightPanel;
