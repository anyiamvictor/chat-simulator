// components/Recorder/Recorder.tsx
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import styles from './RecordButton.module.css';

interface RecorderProps {
  targetRef: React.RefObject<HTMLDivElement|null>;
}

export default function RecordButton({ targetRef }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    const target = targetRef.current;
    if (!target) return;

    await document.fonts.ready;

    const rect = target.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    const canvas = document.createElement('canvas');
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    canvasRef.current = canvas;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      saveAs(webmBlob, `chat-recording-${Date.now()}.webm`);
      chunksRef.current = [];
    };

    recorder.start();
    setRecording(true);
    setMediaRecorder(recorder);

    drawIntervalRef.current = setInterval(async () => {
      try {
        const snapshot = await html2canvas(target, {
          useCORS: true,
          backgroundColor: null,
        });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(snapshot, 0, 0, rect.width, rect.height);
      } catch (err) {
        console.error('Snapshot failed:', err);
      }
    }, 300);

    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder?.state !== 'inactive') {
      mediaRecorder?.stop();

    }
    clearInterval(drawIntervalRef.current!);
    clearInterval(timerRef.current!);
    setRecording(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className={styles.recordingSection}>
      {recording ? (
        <>
          <div className={styles.recordingInfo}>
            <span className={styles.dot}></span> Recording... {formatTime(timer)}
          </div>
          <button onClick={stopRecording} className={styles.stopButton}>
            Stop Recording
          </button>
        </>
      ) : (
        <button onClick={startRecording} className={styles.startButton}>
          Start Recording
        </button>
      )}
    </div>
  );
}
