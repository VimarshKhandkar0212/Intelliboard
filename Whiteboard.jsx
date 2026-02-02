import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import SlidePanel from "./SlidePanel";
import "../Whiteboard.css";

const createBlankSlide = (canvas) => {
  const blank = canvas.toDataURL();
  return {
    id: Date.now(),
    image: blank,
    history: [blank],
    redo: []
  };
};

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [drawing, setDrawing] = useState(false);

  const [pencilWidth] = useState(3);
  const [eraserWidth] = useState(25);
  const [pencilColor] = useState("#000000");

  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  /* ---------- INIT ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const firstSlide = createBlankSlide(canvas);
    setSlides([firstSlide]);
  }, []);

  /* ---------- LOAD SLIDE ---------- */
  useEffect(() => {
    if (!slides[current]) return;

    const img = new Image();
    img.src = slides[current].image;
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [current, slides]);

  /* ---------- SAVE STATE ---------- */
  const saveState = () => {
    const data = canvasRef.current.toDataURL();
    setSlides((prev) =>
      prev.map((s, i) =>
        i === current
          ? { ...s, image: data, history: [...s.history, data], redo: [] }
          : s
      )
    );
  };

  /* ---------- DRAW ---------- */
  const startDraw = (e) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = eraserWidth;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = pencilColor;
      ctx.lineWidth = pencilWidth;
    }

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current = ctx;
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const endDraw = () => {
    if (!drawing) return;
    setDrawing(false);
    ctxRef.current.closePath();
    saveState();
  };

  /* ---------- UNDO ---------- */
  const undo = () => {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== current || s.history.length <= 1) return s;

        const history = s.history.slice(0, -1);
        const img = new Image();
        img.src = history[history.length - 1];
        img.onload = () => {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        };

        return {
          ...s,
          image: history[history.length - 1],
          history,
          redo: [...s.redo, s.image]
        };
      })
    );
  };

  /* ---------- REDO ---------- */
  const redo = () => {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== current || s.redo.length === 0) return s;

        const img = new Image();
        img.src = s.redo[s.redo.length - 1];
        img.onload = () => {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        };

        return {
          ...s,
          image: s.redo[s.redo.length - 1],
          history: [...s.history, s.redo[s.redo.length - 1]],
          redo: s.redo.slice(0, -1)
        };
      })
    );
  };

  /* ---------- CLEAR ---------- */
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const blank = canvasRef.current.toDataURL();
    setSlides((prev) =>
      prev.map((s, i) =>
        i === current ? { ...s, image: blank, history: [blank], redo: [] } : s
      )
    );
  };

  /* ---------- SLIDES ---------- */
  const addSlide = () => {
    const newSlide = createBlankSlide(canvasRef.current);
    setSlides((prev) => [...prev, newSlide]);
    setCurrent(slides.length);
  };

  const deleteSlide = (index) => {
    if (slides.length === 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
    setCurrent(0);
  };

  return (
    <div className="app">
      <SlidePanel
        slides={slides}
        current={current}
        setCurrent={setCurrent}
        addSlide={addSlide}
        deleteSlide={deleteSlide}
      />

      <div className="board">
        <Toolbar
          tool={tool}
          setTool={setTool}
          undo={undo}
          redo={redo}
          clearCanvas={clearCanvas}
        />

        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
