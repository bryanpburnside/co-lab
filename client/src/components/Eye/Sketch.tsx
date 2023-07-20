import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { SocketContext } from './VisualArt';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import paper, { Color } from 'paper';
import styled from 'styled-components';
import { FriendImage } from '../Profile/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaPen, FaPenFancy, FaPalette, FaEraser, FaSave, FaUserPlus } from 'react-icons/fa';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { HuePicker } from 'react-color';
interface DrawProps {
  backgroundColor: string;
  handleBackgroundColorChange: (color: string) => void;
  sendInvite: () => void;
  roomId: string | undefined;
}

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCanvas = styled.canvas<{ backgroundColor: string }>`
  width: 75vw;
  height: 75vh;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 10px;
  box-shadow:  5px 5px 13px #343171,
               -5px -5px 13px #464195;
`;

const DrawContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
`;

const ColorPicker = styled.input`
  display: none;
`;

const ColorPickerWrapper = styled.div`
  display: flex:
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 12.5rem;
  left: 1.75rem;
`;

const PenWidthSliderWrapper = styled.div`
  position: absolute;
  top: 12.5rem;
  left: 1.75rem;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: left center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PenWidthSlider = styled.div`
  background-color: #3d3983;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  button[type="button"] {
    font-size: 6px;
  }
`;

const XIcon = styled.button`
  position: absolute;
  top: 20%;
  left: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #3d3983;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 2;
  border: none;
  padding: 0;
`;

const ButtonContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  z-index: -1;
`;

const ButtonContainerRight = styled.div`
  margin-left: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: start;
`;

const Button = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: white;
  font-size: 48px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    color: #8b88b5;
  }
`;

const CollaboratorImage = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  margin-left: -10px;
  object-fit: cover;
  object-position: center;
  clip-path: circle();
  align-self: center;
  border: 4px solid white;
  border-radius: 50%;
`;

const CollaboratorLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  margin: 0 auto;
`;

const CollaboratorCursor = styled.div<{ x: number; y: number, collaboratorColor: Color }>`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ collaboratorColor }) => collaboratorColor.toCSS(true)};
  pointer-events: none;
`;

const Draw: React.FC<DrawProps> = ({ backgroundColor, setBackgroundColor, handleBackgroundColorChange, openModal, currentCollaborators, roomId }) => {
  const { user } = useAuth0();
  const socket = useContext(SocketContext) as Socket;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathRef = useRef<paper.Path | null>(null);
  const penColorRef = useRef<Color>(new Color('white'));
  const [selectedColor, setSelectedColor] = useState<string>(penColorRef.current.toCSS(true));
  const [penWidth, setPenWidth] = useState(5);
  const penWidthRef = useRef<number>(penWidth);
  const [eraseMode, setEraseMode] = useState(false);
  const [showPenWidthSlider, setShowPenWidthSlider] = useState(false);
  const [collaboratorMouseX, setCollaboratorMouseX] = useState<number | null>(null);
  const [collaboratorMouseY, setCollaboratorMouseY] = useState<number | null>(null);
  const [collaboratorColor, setCollaboratorColor] = useState<Color>(new Color('white'));

  const handlePenColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    penColorRef.current = new Color(value);
    setSelectedColor(value);

    if (pathRef.current) {
      pathRef.current.strokeColor = penColorRef.current;
      paper.view.update();
    }
  };

  const handlePenWidthButtonClick = () => {
    setShowPenWidthSlider(true);
  };

  const handlePenWidthSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const width = Number(value);
    setPenWidth(width);
    penWidthRef.current = width;
  };

  const handlePenWidthSliderClose = () => {
    setShowPenWidthSlider(false);
  };

  const handleEraserClick = () => {
    setEraseMode((prevState) => {
      if (prevState) {
        penColorRef.current = new Color(selectedColor);
        return false;
      } else {
        penColorRef.current = new Color(backgroundColor);
        return true;
      }
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const data = { x: clientX, y: clientY, roomId };
    socket.emit('mouseMove', data);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);

    const tool = new paper.Tool();

    tool.onMouseDown = (event: paper.ToolEvent) => {
      const path = new paper.Path();
      path.strokeColor = penColorRef.current;
      path.strokeWidth = penWidthRef.current;
      path.strokeCap = 'smooth';
      path.strokeJoin = 'round';
      path.add(event.point);
      pathRef.current = path;
      socket.emit('startDrawing', { x: event.point.x, y: event.point.y, color: path.strokeColor.toCSS(true), width: path.strokeWidth, roomId });
    };

    tool.onMouseDrag = (event: paper.ToolEvent) => {
      if (!pathRef.current) return;

      pathRef.current.add(event.point);
      socket.emit('draw', { x: event.point.x, y: event.point.y, color: penColorRef.current.toCSS(true), width: penWidthRef.current, roomId });
    };

    tool.onMouseUp = () => {
      if (!pathRef.current) return;

      pathRef.current.smooth();
      pathRef.current = null;
      socket.emit('endDrawing', { roomId });
    };

    socket.on('changeBackgroundColor', (color) => {
      setBackgroundColor(color);
      socket.emit('changeBackgroundColor', color);
    });

    socket.on('mouseMove', ({ x, y }) => {
      setCollaboratorMouseX(x);
      setCollaboratorMouseY(y);
    });

    socket.on('startDrawing', (data) => {
      const path = new paper.Path();
      path.strokeColor = new Color(data.color);
      setCollaboratorColor(new Color(data.color));
      path.strokeWidth = data.width;
      path.strokeCap = 'smooth';
      path.strokeJoin = 'round';
      path.add(new paper.Point(data.x, data.y));
      pathRef.current = path;
    });

    socket.on('draw', (data) => {
      if (!pathRef.current) return;
      pathRef.current.add(new paper.Point(data.x, data.y));
      pathRef.current.strokeColor = new Color(data.color);
      pathRef.current.strokeWidth = data.width;
    });

    socket.on('endDrawing', () => {
      if (!pathRef.current) return;

      pathRef.current.smooth();
      pathRef.current = null;
    });

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      tool.remove();
      paper.project.clear();
    };
  }, [socket, roomId]);

  const saveArt = async (art: string) => {
    const userId = user?.sub;
    try {
      await axios.post('/visualart', { art, userId });
    } catch (err) {
      console.error('Failed to SAVE art to db at client:', err);
    }
  };

  const handleSaveClick = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height } = canvas;
    const { backgroundColor } = getComputedStyle(canvas);

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    const paths = paper.project.activeLayer.children;
    paths.forEach((path) => {
      context.strokeStyle = path.strokeColor.toCSS(true);
      context.lineWidth = path.strokeWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      path.segments.forEach((segment, index) => {
        if (index === 0) {
          context.beginPath();
          context.moveTo(segment.point.x, segment.point.y);
        } else {
          context.lineTo(segment.point.x, segment.point.y);
        }
      });

      context.stroke();
    });

    const art = canvas.toDataURL();

    await saveArt(art);
  };

  return (
    <CanvasContainer>
      <StyledCanvas
        id="canvas"
        ref={canvasRef}
        backgroundColor={backgroundColor}
      />
      {collaboratorMouseX && collaboratorMouseY && (
        <CollaboratorCursor
          x={collaboratorMouseX}
          y={collaboratorMouseY}
          collaboratorColor={collaboratorColor}
        />
      )}
      <DrawContainer>
        <ColorPickerWrapper>
          <HuePicker
            color={selectedColor}
            onChange={(color) => handlePenColorChange({ target: { value: color.hex } })}
            height={150}
            width={10}
            direction='vertical'
          />
        </ColorPickerWrapper>
        <PenWidthSliderWrapper>
          {showPenWidthSlider && (
            <PenWidthSlider>
              <input
                type="range"
                value={penWidth.toString()}
                onChange={handlePenWidthSliderChange}
                min={1}
                max={100}
                className="slider is-small"
              />
              {/* <Button
                  type="button"
                  onClick={handlePenWidthSliderClose}
                >
                  Close
                </Button> */}
              <XIcon onClick={handlePenWidthSliderClose}>
                <FontAwesomeIcon icon={faXmark} />
              </XIcon>
            </PenWidthSlider>
          )}
        </PenWidthSliderWrapper>
        <ButtonContainer style={{ marginTop: '25rem' }}>
          <ColorPicker
            type="color"
            id="bg-color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
          />
          <Button
            type="button"
            onClick={() => document.getElementById('bg-color')?.click()}
          >
            <FaPalette />
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            type="button"
            onClick={() => document.getElementById('pen-color')?.click()}
          >
            <FaPen />
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            type="button"
            onClick={handlePenWidthButtonClick}
          >
            <FaPenFancy />
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            onClick={handleEraserClick}
          >
            <FaEraser />
          </Button>
        </ButtonContainer>
        {user &&
          <ButtonContainer>
            <Button
              type="submit"
              onClick={handleSaveClick}
            >
              <FaSave />
            </Button>
          </ButtonContainer>
        }
      </DrawContainer>
      <ButtonContainerRight>
        <Button
          type="button"
          onClick={openModal}
        >
          <FaUserPlus />
        </Button>
        {currentCollaborators &&
          currentCollaborators.map((user: Object, i: number) =>
            <CollaboratorLink
              key={i}
              href={`http://localhost:8000/profile/${user.userId}`}
              target="_blank"
            >
              <CollaboratorImage src={user.picture} />
            </CollaboratorLink>
          )
        }
      </ButtonContainerRight>
    </CanvasContainer >
  );
};

export default Draw;
