import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface CanvasProps {
  width: number;
  height: number;
}

type Coordinate = {
  x: number;
  y: number;
};

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [instrument, setInstrument] = useState<Tone.Instrument | null>(null);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    setSynth(new Tone.Synth().toDestination());
  }, []);

  useEffect(() => {
    if (instrument) {
      instrument.releaseAll();
    }
  }, [instrument]);

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
      setIsPainting(true);
      if (synth) {
        synth.triggerAttack(coordinates.x / width * 400 + 200);
      }
    }
  }, [width, synth]);

  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  const exitPaint = useCallback(() => {
    setIsPainting(false);
    setMousePosition(undefined);
    if (synth) {
      synth.triggerRelease(); // Release the currently triggered note
    }
  }, [synth]);
  

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
  };

  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = 'red';
      context.lineJoin = 'round';
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const instrumentName = event.target.value;
    setInstrument(getInstrumentByName(instrumentName));
  };

  const getInstrumentByName = (instrumentName: string): Tone.Instrument | null => {
    switch (instrumentName) {
      case 'synth':
        return new Tone.Synth().toDestination();
      case 'membraneSynth':
        return new Tone.MembraneSynth().toDestination();
      case 'pluckSynth':
        return new Tone.PluckSynth().toDestination();
      default:
        return null;
    }
  };

  return (
    <>
      <canvas ref={canvasRef} height={height} width={width} />
      <div>
        <label htmlFor="instrument">Choose an instrument:</label>
        <select id="instrument" onChange={handleInstrumentChange}>
          <option value="synth">Synth</option>
          <option value="membraneSynth">Membrane Synth</option>
          <option value="pluckSynth">Pluck Synth</option>
        </select>
      </div>
    </>
  );
};

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export default Canvas;
