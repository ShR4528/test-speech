'use client';
import RealTimeSpeechRecognition from './RealTimeSpeechRecognition';

export default function SpeechPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <RealTimeSpeechRecognition />
    </div>
  );
}