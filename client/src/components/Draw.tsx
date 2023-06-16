


import React, { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import paper, { Color } from 'paper';

const Draw: React.FC = () => {
  const { user } = useAuth0();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);

    const tool = new paper.Tool();
    let path: paper.Path | null;

    tool.onMouseDown = (event: paper.ToolEvent) => {
      path = new paper.Path();
      path.strokeColor = new (Color as typeof Color)('white');
      path.strokeWidth = 5;
      path.strokeCap = 'smooth';
      path.strokeJoin = 'round';
      path.add(event.point);
    };

    tool.onMouseDrag = (event: paper.ToolEvent) => {
      if (path) {
        path.add(event.point);
      }
    };

    tool.onMouseUp = () => {
      path = null;
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
  }

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
      <button type="submit" onClick={handleSaveClick}>Save</button>
      <button>Add Shape</button>
    </>
  );
}

export default Draw;
