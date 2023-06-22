import React, { useState } from 'react';

interface TTSProps {
  text: string;
}

const TTS: React.FC<TTSProps> = ({ text }) => {
  const handleSpeakClick = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  };

  // Auto speak when component is mounted
  React.useEffect(() => {
    handleSpeakClick();
  }, [text]);

  return null;

};

export default TTS;
