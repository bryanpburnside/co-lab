import React, { useState, useEffect } from "react";
import '../styles.css';
import { FaMicrophoneAlt } from 'react-icons/fa';

interface STTProps {
  updateTranscript: (newTranscript: string) => void;
}

interface SpeechToTextButtonProps {
  onClick: () => void;
}

const STT: React.FC<STTProps> = ({ updateTranscript }) => {
  // const isListening = useState(false);

  //functionality to start the web speech api listening
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          //only want the final result for the transcript
          if (result.isFinal) {
              const transcript = result[0].transcript;
              updateTranscript(transcript);
          }
      }
  };

    recognition.start();
  };

  const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{ marginTop: '2px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', fontSize: '30px' }}
    >
      <FaMicrophoneAlt />
    </button>
  );


  return(
    <div className="stt">
      <SpeechToTextButton onClick={ startListening } />
    </div>
  );
};

export default STT;