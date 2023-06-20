import React, { useState } from 'react';
import STT from './STT';


const TranscriptLog: React.FC = () => {
  const [transcript, setTranscript] = useState('');

  const updateTranscript = (newTranscript: string) => {
      setTranscript((prevTranscript) => prevTranscript + ' ' + newTranscript);
  };

  return (
      <div className="transcript-log">
          <STT updateTranscript={updateTranscript} />
          <p>{transcript}</p>
      </div>
  );

};

export default TranscriptLog;