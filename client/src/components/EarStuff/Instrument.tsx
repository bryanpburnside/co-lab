import React, { useEffect, useRef, useState } from 'react';
import * as hand from 'handtrackjs';
import { Model } from 'handtrackjs';
import snareSound from '../../../../assests/sfx/drum-sound.mp3';
import snare from '../../../../assests/pics/snare.jpeg';
import './Video.css';

const Instrument = () => {
  const modelParams = {
    flipHorizontal: true,
    imageScaleFactor: 0.7,
    maxNumBoxes: 3,
    iouThreshold: 0.5,
    scoreThreshold: 0.20,
  };

  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [overlayText, setOverlayText] = useState('Snare');

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
    </div>
  );
};

export default Instrument;
