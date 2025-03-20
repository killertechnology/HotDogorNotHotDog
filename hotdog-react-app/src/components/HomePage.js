import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Homepage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track page load event once on mount
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'hotdog_page_load', {
        event_category: 'HotDogPage',
        event_label: 'Page Loaded'
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDetectClick = async () => {
    if (!selectedFile) return;
    
    // Track detect button click
    if (window.gtag) {
      window.gtag('event', 'hotdog_detect_click', {
        event_category: 'HotDogPage',
        event_label: 'Detect Button Clicked'
      });
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post('https://api.flex-ai.com/hotdog/detect', formData);
      setResult(res.data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedImages = [
    { label: "Hot Dog", src: "/images/hotdog.jpg" },
    { label: "Banana", src: "/images/banana.jpg" },
    { label: "Car", src: "/images/car.jpg" },
    { label: "Elephant", src: "/images/elephant.jpg" },
  ];

  const handlePredefinedClick = (imagePath) => {
    fetch(imagePath)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], imagePath.split('/').pop(), { type: blob.type });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        setResult(null);

        // Track thumbnail click
        if (window.gtag) {
          window.gtag('event', 'hotdog_thumbnail_click', {
            event_category: 'HotDogPage',
            event_label: imagePath
          });
        }
      });
  };

  // Play sound and track detection result event when result is updated
  useEffect(() => {
    if (result === "Hot Dog") {
      const dingSound = new Audio('/sounds/ding.mp3');
      dingSound.play();
    } else if (result === "Not Hot Dog") {
      const buzzerSound = new Audio('/sounds/buzzer.mp3');
      buzzerSound.play();
    }
    if (result) {
      if (window.gtag) {
        window.gtag('event', 'hotdog_detection_result', {
          event_category: 'HotDogPage',
          event_label: result
        });
      }
    }
  }, [result]);
  
  return (
    <div className='hotdogpage'>
      <table border={0} align='center'>
        <tbody>
          <tr>
            <td className="container">
              {previewUrl && (
                <div>
                  <img
                    align='center'
                    src={previewUrl}
                    alt="Preview"
                    className="my-4-selected object-contain"
                    style={{ maxWidth: '450px', paddingBottom: '10px' }}
                  /><br />
                  <button
                    onClick={handleDetectClick}
                    className="bubbly-button"
                  >
                    Hot Dog or Not Hot Dog??
                  </button>
                  <div className="overlay">
                    {result === "Hot Dog" ? (
                      <>
                        <img src="/images/checkmark.png" alt="Definitely a Hot Dog" />
                        <div className="result-hotdog">Hot Dog!!!</div>
                      </>
                    ) : result === "Not Hot Dog" ? (
                      <>
                        <img src="/images/redx.png" alt="Sorry, not a Hot Dog" />
                        <div className="result-nothotdog">Not Hot Dog!</div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <h1>Choose an Image!</h1>
            </td>
          </tr>
          <tr>
            <td>
              <div className="flex justify-center gap-4 mt-6">
                {predefinedImages.map(img => (
                  <img
                    key={img.label}
                    src={img.src}
                    alt={img.label}
                    className="mythumbs h-[100px] object-cover cursor-pointer"
                    onClick={() => handlePredefinedClick(img.src)}
                  />
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Or try your own!</h1>
            </td>
          </tr>
          <tr>
            <td>
              <input type="file" onChange={handleFileChange} className="mb-4" />&nbsp;
            </td>
          </tr>
        </tbody>
      </table>

      {isLoading && (
        <div className="centered-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite' }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              style={{ opacity: 0.85 }}
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
              style={{ opacity: 0.95 }}
            />
          </svg>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
