import React, { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import paper, { Color } from 'paper';

const Draw: React.FC = () => {
  const { user } = useAuth0();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathRef = useRef<paper.Path | null>(null);
  const penColorRef = useRef<Color>(new Color('white'));

  const handlePenColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    penColorRef.current = new Color(value);

    if (pathRef.current) {
      pathRef.current.strokeColor = penColorRef.current;
      paper.view.update();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);

    const tool = new paper.Tool();

    tool.onMouseDown = (event: paper.ToolEvent) => {
      const path = new paper.Path();
      path.strokeColor = penColorRef.current;
      path.strokeWidth = 5;
      path.strokeCap = 'smooth';
      path.strokeJoin = 'round';
      path.add(event.point);
      pathRef.current = path;
    };

    tool.onMouseDrag = (event: paper.ToolEvent) => {
      if (pathRef.current) {
        pathRef.current.add(event.point);
      }
    };

    tool.onMouseUp = () => {
      pathRef.current = null;
    };

    const resizeCanvas = () => {
      paper.view.viewSize = new paper.Size(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      tool.remove();
    };
  }, []);

  const saveArt = async (art: string) => {
    try {
      await axios.post('/visualart', { art, user });
    } catch (err) {
      console.error('Failed to SAVE art to db at client:', err);
    }
  };

  const handleSaveClick = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const art = canvas.toDataURL();

    await saveArt(art);
  };

  return (
    <>
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{ width: '100vw', height: '100vh' }}
      />
      <input type="color" value={penColorRef.current.toCSS(true)} onChange={handlePenColorChange} />
      <button type="submit" onClick={handleSaveClick}>Save</button>
    </>
  );
};

export default Draw;
