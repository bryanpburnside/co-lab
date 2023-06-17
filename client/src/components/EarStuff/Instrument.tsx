// import React, { useEffect, useRef, useState } from 'react';
// import * as hand from 'handtrackjs';
// import { Model } from 'handtrackjs';
// import snareSound from '../../../../assests/sfx/drum-sound.mp3';
// import './Video.css';

// const Instrument = () => {
//   const modelParams = {
//     flipHorizontal: true,
//     imageScaleFactor: 0.7,
//     maxNumBoxes: 3,
//     iouThreshold: 0.5,
//     scoreThreshold: 0.20,
//   };

//   const video = useRef<HTMLVideoElement>(null);
//   const audioContext = useRef<AudioContext | null>(null);
//   const snareBuffer = useRef<AudioBuffer | null>(null);
//   const [overlayText, setOverlayText] = useState('Snare');

//   let model: Model;

//   useEffect(() => {
//     const runDetection = () => {
//       model.detect(video.current!).then((predictions: any[]) => {
//         if (predictions.length !== 0) {
//           const hand1 = predictions[0].bbox;
//           const x = hand1[0];
//           const y = hand1[1];
//           console.log(predictions[0].label, y, x);
//           if (y > 250) {
//             if (x > 400) {
//               playSnareSound();
//             }
//           }
//         }
//       });
//     };

//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//         if (video.current) {
//           video.current.srcObject = stream;
//         }
//         setInterval(runDetection, 150);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     hand.startVideo(video.current!).then((status: boolean) => {
//       if (status) {
//         startVideo();
//       }
//     });

//     hand.load(modelParams).then((lmodel) => {
//       model = lmodel;
//     });

//     // Initialize the audio context and load the snare sound
//     audioContext.current = new AudioContext();
//     loadSnareSound();
//   }, []);

//   const loadSnareSound = async () => {
//     const response = await fetch(snareSound);
//     const arrayBuffer = await response.arrayBuffer();
//     audioContext.current!.decodeAudioData(arrayBuffer, (buffer) => {
//       snareBuffer.current = buffer;
//     });
//   };

//   const playSnareSound = () => {
//     const source = audioContext.current!.createBufferSource();
//     source.buffer = snareBuffer.current!;
//     source.connect(audioContext.current!.destination);
//     source.start(0);
//   };

//   return (
//     <div className="instrument-container">

//       <div className="video-wrapper">
//         <video id="video" ref={video} className="resized-video" />
//         <div className="overlay-square" />
//         <div className="overlay-text" style={{ top: '1100px', left: '350px' }}>
//           {overlayText}
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default Instrument;










import React, { useEffect, useRef, useState } from 'react';
import * as hand from 'handtrackjs';
import { Model } from 'handtrackjs';
import snareSound from '../../../../assests/sfx/drum-sound.mp3';
import snare from '../../../../assests/pics/snare.jpeg';
import './Video.css';
import RecordRTC from 'recordrtc';

const Instrument = () => {
  const modelParams = {
    flipHorizontal: true,
    imageScaleFactor: 0.7,
    maxNumBoxes: 3,
    iouThreshold: 0.5,
    scoreThreshold: 0.2,
  };

  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [overlayText, setOverlayText] = useState('Snare');
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const virtualAudioRef = useRef(null);

  let model: Model;

  useEffect(() => {
    const runDetection = () => {
      model.detect(video.current!).then((predictions: any[]) => {
        if (predictions.length !== 0) {
          const hand1 = predictions[0].bbox;
          const x = hand1[0];
          const y = hand1[1];
          console.log(predictions[0].label, y, x);
          if (y > 250) {
            if (x > 400) {
              audio.current!.play();
            }
          }
        }
      });
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (video.current) {
          video.current.srcObject = stream;
        }
        setInterval(runDetection, 150);
      } catch (error) {
        console.log(error);
      }
    };

    hand.startVideo(video.current!).then((status: boolean) => {
      if (status) {
        startVideo();
      }
    });

    hand.load(modelParams).then((lmodel) => {
      model = lmodel;
    });
  }, []);

  const startRecording = () => {
    navigator.mediaDevices
      .getDisplayMedia({ audio: true, video: true })
      .then((stream) => {
        mediaRecorderRef.current = new RecordRTC(stream, {
          type: 'audio',
          recorderType: RecordRTC.StereoAudioRecorder,
          mimeType: 'audio/wav',
        });

        
        virtualAudioRef.current = document.createElement('audio');
        virtualAudioRef.current.srcObject = stream;

        
        virtualAudioRef.current.play();

        
        mediaRecorderRef.current.startRecording();

        setRecording(true);
      })
      .catch((error) => {
        console.error('Error getting mic and cam:', error);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stopRecording(() => {
      // Stop capturing the system audio by pausing the virtual audio element
      virtualAudioRef.current.pause();

      // Get the recorded audio data
      const audioBlob = mediaRecorderRef.current.getBlob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    });

    setRecording(false);
  };

  const playRecording = () => {
    audio.current!.play();
  };

  return (
    <div className="instrument-container">
      <div className="video-wrapper">
        <video id="video" ref={video} className="resized-video" />
        <div className="overlay-square" />
        <div className="overlay-text" style={{ top: '1100px', left: '350px' }}>
          {overlayText}
        </div>
      </div>
      <audio id="audio" ref={audio}>
        <source src={snareSound} type="audio/mpeg" />
      </audio>
      <img src={snare} alt="" />

      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={playRecording} disabled={!audioURL}>
        Play Recording
      </button>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};

export default Instrument;









// import React, { useEffect, useRef, useState } from 'react';
// import snareSound from '../../../../assests/sfx/drum-sound.mp3';
// import snare from '../../../../assests/pics/snare.jpeg';
// import './Video.css';

// const Instrument = () => {
//   const [recording, setRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then((stream) => {
//         mediaRecorderRef.current = new MediaRecorder(stream);
//         mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
//       })
//       .catch((error) => {
//         console.error('Error accessing microphone:', error);
//       });
//   }, []);

//   const handleDataAvailable = (event) => {
//     if (event.data.size > 0) {
//       const audioBlob = new Blob([event.data], { type: 'audio/wav' });
//       const audioUrl = URL.createObjectURL(audioBlob);
//       setAudioURL(audioUrl);
//     }
//   };

//   const startRecording = () => {
//     mediaRecorderRef.current.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   const playRecording = () => {
//     audioRef.current.play();
//   };

//   return (
//     <div className="instrument-container">
//       <button onClick={startRecording} disabled={recording}>
//         Start Recording
//       </button>
//       <button onClick={stopRecording} disabled={!recording}>
//         Stop Recording
//       </button>
//       <button onClick={playRecording} disabled={!audioURL}>
//         Play Recording
//       </button>
//       <audio ref={audioRef} src={audioURL} controls />
//     </div>
//   );
// };

// export default Instrument;
