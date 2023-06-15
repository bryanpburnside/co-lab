import React, { useState } from 'react';
import Draw from './Draw';
import RandomPattern from './RandomPattern';

enum ActiveComponent {
  DrawMode,
  PatternMode
}

const VisualArt: React.FC = () => {
  const { DrawMode, PatternMode } = ActiveComponent
  const [mode, setMode] = useState<ActiveComponent>(DrawMode);

  const renderComponent = () => {
    switch (mode) {
      case PatternMode:
        return <RandomPattern />;
      case DrawMode:
        return <Draw />;
    }
  }

  return (
    <div>
      <button onClick={() => setMode(DrawMode)}>Drawing</button>
      <button onClick={() => setMode(PatternMode)}>Pattern</button>
      {renderComponent()}
    </div>
  )
}

export default VisualArt;
