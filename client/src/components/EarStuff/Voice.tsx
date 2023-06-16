





// import React, { useEffect, useState } from 'react';

// function Voice() {
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     const playNote = (note: string) => {
//       // Create an audio context
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//       // Create an oscillator node
//       const oscillator = audioContext.createOscillator();
      
//       // Connect the oscillator to the audio context destination (speakers)
//       oscillator.connect(audioContext.destination);

//       // Start playing the oscillator
//       oscillator.start();

//       // Stop playing the oscillator after 1 second
//       setTimeout(() => {
//         oscillator.stop();
//       }, 1000);
//     };

//     const handleKeyDown = (event: KeyboardEvent) => {
//       // Map keyboard keys to notes
//       const keyNoteMap = {
//         a: 'C',
//         s: 'D',
//         d: 'E',
//         f: 'F',
//         g: 'G',
//         h: 'A',
//         j: 'B',
//       };

//       // Check if the pressed key corresponds to a note
//       if (keyNoteMap.hasOwnProperty(event.key)) {
//         // Prevent default behavior of the key press
//         event.preventDefault();

//         // Play the corresponding note
//         playNote(keyNoteMap[event.key]);
//       }
//     };

//     const handleMouseDown = () => {
//       setIsPlaying(true);
//     };

//     const handleMouseUp = () => {
//       setIsPlaying(false);
//     };

//     // Attach event listeners when the component mounts
//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('mousedown', handleMouseDown);
//     window.addEventListener('mouseup', handleMouseUp);

//     // Detach event listeners when the component unmounts
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('mousedown', handleMouseDown);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Virtual Instrument</h1>
//       <p>Press the keys or click and hold the mouse to play</p>
//       <p>{isPlaying ? 'Playing' : 'Not Playing'}</p>
//     </div>
//   );
// }

// export default Voice;










import React, { useEffect, useState } from 'react';

function Voice() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [player, setPlayer] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => setStream(stream))
      .catch((error) => console.error('Error accessing microphone:', error));

    return () => {
      // Clean up the media stream and player when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (player) {
        player.close();
      }
    };
  }, []);

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        processAudio(audioUrl);
      });

      mediaRecorder.start();
      setRecording(mediaRecorder);
    }
  };

  const stopRecording = () => {
    if (recording) {
      recording.stop();
      setRecording(null);
    }
  };

  const processAudio = (audioUrl: string) => {
    // Process the audio using the Magenta.js library or send it to the server for processing.
    // Implement your own logic for tone transfer or instrument transformation here.
    // You may need to consult the Magenta.js documentation or use a server-side solution.

    // Once processed, play back the transformed audio using the Web Audio API.
    const audioElement = new Audio();
    audioElement.src = audioUrl;
    audioElement.controls = true;

    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNode.connect(audioContext.destination);
    audioElement.play();

    setPlayer(audioContext);
  };

  const stopPlayback = () => {
    if (player) {
      player.close();
      setPlayer(null);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording !== null}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={recording === null}>
        Stop Recording
      </button>
      <button onClick={stopPlayback} disabled={player === null}>
        Stop Playback
      </button>
      {audioURL && (
        <audio controls src={audioURL}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default Voice;

















// import React, { useEffect, useState } from 'react';
// import * as mm from '@magenta/music';
// import * as tf from '@tensorflow/tfjs';

// const Voice = () => {
//   const [audioContext, setAudioContext] = useState(null);
//   const [mediaStreamSource, setMediaStreamSource] = useState(null);
//   const [recorder, setRecorder] = useState(null);
//   const [recordedBuffer, setRecordedBuffer] = useState(null);
//   const [recordedAudio, setRecordedAudio] = useState(null);
//   const [generatedMusic, setGeneratedMusic] = useState(null);

//   useEffect(() => {
//     createAudioContext();
//   }, []);

//   // Create an audio context
//   const createAudioContext = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     setAudioContext(context);
//   };

//   // Start recording user's voice
//   const handleRecord = () => {
//     if (!audioContext) {
//       console.error('Audio context is not available.');
//       return;
//     }

//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then(function (stream) {
//         // Create a media stream audio source
//         const source = audioContext.createMediaStreamSource(stream);
//         setMediaStreamSource(source);

//         // Create a recorder
//         const recorderNode = new Recorder(source);
//         setRecorder(recorderNode);

//         // Start recording
//         recorderNode.record();
//       })
//       .catch(function (error) {
//         console.error('Error accessing microphone:', error);
//       });
//   };

//   // Stop recording
//   const handleStop = () => {
//     if (!recorder) {
//       console.error('Recorder is not available.');
//       return;
//     }

//     recorder.stop();
//     recorder.exportWAV(function (blob) {
//       // Store the recorded audio buffer
//       setRecordedBuffer(blob);
//       setRecordedAudio(URL.createObjectURL(blob));
//     });
//   };

//   // Convert the recorded voice to an instrument
//   const convertToInstrument = () => {
//     if (!audioContext || !recordedBuffer) {
//       console.error('Audio context or recorded buffer is not available.');
//       return;
//     }

//     audioContext.decodeAudioData(recordedBuffer, function (buffer) {
//       const source = audioContext.createBufferSource();
//       source.buffer = buffer;

//       // Create audio nodes and connect them
//       const filter = audioContext.createBiquadFilter();
//       filter.type = 'lowpass';
//       filter.frequency.value = 1000;

//       const gain = audioContext.createGain();
//       gain.gain.value = 0.5;

//       // Connect the nodes
//       source.connect(filter);
//       filter.connect(gain);
//       gain.connect(audioContext.destination);

//       // Start playing the converted audio
//       source.start();

//       // Generate music using Magenta.js
//       const musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
//       musicRNN.initialize().then(() => {
//         const music = musicRNN.continueSequence(
//           mm.sequences.quantizeNoteSequence(mm.sequences.fromBlob(recordedBuffer)),
//           40,
//           0.5
//         );

//         tf.browser
//           .toPixels(music.toTensor(), document.createElement('canvas'))
//           .then((canvas) => {
//             canvas.toBlob((blob) => {
//               setGeneratedMusic(URL.createObjectURL(blob));
//             });
//           });
//       });
//     });
//   };

//   return (
//     <>
//       <h1>TESTTESTTESTTESTTESTTEST</h1>
//       <button onClick={handleRecord}>Start Recording</button>
//       <button onClick={handleStop}>Stop Recording</button>
//       {recordedAudio && <audio src={recordedAudio} controls />}
//       {generatedMusic && <audio src={generatedMusic} controls />}
//     </>
//   );
// };

// export default Voice;
