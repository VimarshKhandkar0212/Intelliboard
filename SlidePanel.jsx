const SlidePanel = ({ slides, current, setCurrent, addSlide, deleteSlide }) => {
  return (
    <div className="slides">
      {slides.map((_, i) => (
        <div
          key={i}
          className={`slide ${i === current ? "active" : ""}`}
          onClick={() => setCurrent(i)}
        >
          Slide {i + 1}
          <span
            onClick={(e) => {
              e.stopPropagation();
              deleteSlide(i);
            }}
          >
            ✕
          </span>
        </div>
      ))}
      <button className="add-slide" onClick={addSlide}>
        ＋
      </button>
    </div>
  );
};

export default SlidePanel;
