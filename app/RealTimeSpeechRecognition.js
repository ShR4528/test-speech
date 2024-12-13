import React, { useState, useEffect } from 'react';

const RealTimeSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [realTimeTranscript, setRealTimeTranscript] = useState('');
  const [finalTranscripts, setFinalTranscripts] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [browserSupport, setBrowserSupport] = useState(true);

  

  useEffect(() => {
    console.log('Initializing speech recognition...');
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        console.log(webkitSpeechRecognition.supportedLanguages);
      const recognitionInstance = new window.webkitSpeechRecognition();
      
      // Configuration for real-time transcription
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      // Handle real-time speech results
      recognitionInstance.onresult = (event) => {
        console.log('Received speech recognition results:', event);
        const results = event.results;
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < results.length; ++i) {
          if (results[i].isFinal) {
            finalTranscript += results[i][0].transcript + ' ';
            // Add final transcript to list of completed transcripts
            setFinalTranscripts(prev => [...prev, results[i][0].transcript]);
          } else {
            // Show interim (in-progress) results
            interimTranscript += results[i][0].transcript;
          }
        }

        // Update real-time transcript
        setRealTimeTranscript(interimTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.log('Speech recognition error:', event);
        if (event.error === 'no-speech') {
          console.error('No speech detected. Please try again.');
          // Retry speech recognition after a short delay
          setTimeout(() => {
            recognitionInstance.start();
          }, 1000);
        } else {
          console.error('Speech recognition error:', event.error);
        }
        setIsListening(false);
      };
    //   recognitionInstance.onerror = (event) => {
    //     console.error('Speech recognition error:', event.error);
    //     setIsListening(false);
    //   };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        // Automatically restart listening if it was intentionally stopped
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Web Speech API is not supported in this browser');
      setBrowserSupport(false);
    }

    // Cleanup function
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };

  const clearTranscripts = () => {
    setRealTimeTranscript('');
    setFinalTranscripts([]);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Real-Time Speech Recognition</h2>
      
      {/* Browser Support Warning */}
      {!browserSupport && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Browser Not Supported! </strong>
          <span className="block sm:inline">
            Please use Chrome, Edge, or another Chromium-based browser.
          </span>
        </div>
      )}

      {/* Real-time Transcription Display */}
      <div className="mb-4 p-2 border rounded bg-white min-h-[100px]">
        <p className="text-gray-500 italic">
          {realTimeTranscript || 'Speak now...'}
        </p>
      </div>

      {/* Completed Transcripts */}
      {finalTranscripts.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Completed Transcripts:</h3>
          <ul className="bg-white border rounded p-2">
            {finalTranscripts.map((transcript, index) => (
              <li key={index} className="border-b last:border-b-0 py-1">
                {transcript}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={toggleListening}
          disabled={!browserSupport}
          className={`px-4 py-2 rounded text-white ${
            !browserSupport
              ? 'bg-gray-400 cursor-not-allowed'
              : (isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600')
          } flex-grow`}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        
        <button 
          onClick={clearTranscripts}
          disabled={!browserSupport}
          className={`px-4 py-2 text-white rounded ${
            !browserSupport
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Additional Guidance */}
      <div className="mt-4 text-sm text-gray-600">
        <p>🎤 Tip: Ensure your microphone is enabled and working.</p>
        <p>🌐 Best used in Chrome or Edge browsers.</p>
      </div>
    </div>
  );
};


export default React.memo(RealTimeSpeechRecognition, (prevProps, nextProps) => {
    // Suppress hydration warning
    return true;
  });
//export default RealTimeSpeechRecognition;
