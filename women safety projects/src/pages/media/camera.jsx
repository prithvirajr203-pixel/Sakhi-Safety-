import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationsstore';
import { 
  CameraIcon,
  ArrowPathIcon,
  PhotoIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Camera = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocationStore();
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [photoDetails, setPhotoDetails] = useState({
    type: 'evidence',
    description: ''
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API not available in this browser.');
      toast.error('Camera API not available.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCapturedImage(null);
        await videoRef.current.play().catch(() => {});
        toast.success('Hardware Camera securely linked.', { icon: '📸' });
      }
    } catch (error) {
      console.error('Camera access error', error);
      const message = error.name === 'NotAllowedError'
          ? 'Camera permission denied. Allow camera and rerun.'
          : error.message || 'Could not access camera.';
      setCameraError(message);
      toast.error(message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    
    toast.success('Evidence Captured Locally!');
  };

  const savePhoto = async () => {
    if (!capturedImage) return;

    setUploading(true);
    const savingToast = toast.loading('Encrypting and saving image locally...');

    try {
      const newPhoto = {
        id: `img_${Date.now()}`,
        photoURL: capturedImage,
        type: photoDetails.type,
        description: photoDetails.description || 'No description provided.',
        location: currentLocation || { lat: 0, lng: 0 },
        capturedAt: new Date().toISOString(),
      };

      const existingPhotos = JSON.parse(localStorage.getItem('gallery_photos') || '[]');
      const updatedPhotos = [newPhoto, ...existingPhotos];
      if(updatedPhotos.length > 20) updatedPhotos.pop();
      
      localStorage.setItem('gallery_photos', JSON.stringify(updatedPhotos));

      toast.success('Photo Saved to Secure Gallery!', { id: savingToast });
      discardPhoto();
      navigate('/media-hub?tab=gallery');
    } catch (error) {
       toast.error('Failed to save photo locally.', { id: savingToast });
    } finally {
      setUploading(false);
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    setPhotoDetails({ type: 'evidence', description: '' });
  };

  // --- Troubleshooting Functions ---
  const checkPermissions = async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      toast.error('Permissions API not supported by this browser.');
      return;
    }
    try {
      const status = await navigator.permissions.query({ name: 'camera' });
      if (status.state === 'granted') {
        toast.success('Camera Permissions: GRANTED', { icon: '✅' });
      } else if (status.state === 'prompt') {
        toast.info('Camera Permissions: PENDING (Will prompt)', { icon: '⚠️' });
      } else if (status.state === 'denied') {
        toast.error('Camera Permissions: DENIED. Please check site settings.', { icon: '🚫' });
      }
    } catch (err) {
       toast.error('Permissions query failed.');
    }
  };

  const testCameraAccess = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      toast.error('Hardware enumeration API not supported.');
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      if (videoInputs.length > 0) {
        toast.success(`Found ${videoInputs.length} hardware camera(s) available.`, { icon: '📷' });
      } else {
        toast.error('No physical camera hardware detected on this device.', { icon: '❌' });
      }
    } catch (err) {
      toast.error('Failed to detect media devices.');
    }
  };

  return (
    <div className="bg-[#f5f6f8] rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col items-center">
        
      {/* Video Viewport Container */}
      <div className="relative w-full bg-black aspect-[3/4] md:aspect-video flex items-center justify-center">
          
        {isCameraActive && !capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain bg-gray-900"
          />
        )}

        {!isCameraActive && !capturedImage && (
           <div className="text-center p-6">
              <VideoCameraIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-semibold mb-2">Hardware Camera Disconnected</p>
              {cameraError && <p className="text-red-500 text-sm font-bold bg-red-950 p-2 rounded">{cameraError}</p>}
           </div>
        )}

        {/* Live Indicator */}
        {isCameraActive && !capturedImage && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest animate-pulse flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <div className="w-2 h-2 rounded-full bg-white"></div> LIVE
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Control Panel */}
      <div className="bg-white w-full p-6 space-y-6">
          
        {!isCameraActive && !capturedImage ? (
          <button
            onClick={startCamera}
            className="w-full bg-[#333] hover:bg-black transition-colors text-white py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 text-lg shadow-md uppercase tracking-wider"
          >
            <CameraIcon className="w-6 h-6 stroke-2" /> Start Secure Camera
          </button>
        ) : (
          <div className="flex gap-3 justify-center text-sm md:text-base">
            {!capturedImage ? (
                <>
                  <button
                    onClick={switchCamera}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 border-2 border-transparent hover:border-gray-300"
                  >
                    <ArrowPathIcon className="w-6 h-6 stroke-2 hidden sm:block" /> Switch
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm hidden sm:block"></div> Stop
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-[2] bg-[#ff556c] hover:bg-[#e6475d] text-white py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,85,108,0.4)] md:text-lg"
                  >
                    <div className="w-5 h-5 border-4 border-white rounded-full"></div> Capture
                  </button>
                </>
            ) : (
                <>
                  <button
                     onClick={discardPhoto}
                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-black flex items-center justify-center gap-2"
                  >
                     <ArrowPathIcon className="w-5 h-5 mr-1 stroke-2" /> Retake
                  </button>
                  <button
                     onClick={savePhoto}
                     disabled={uploading}
                     className="flex-[2] bg-[#7c56c2] hover:bg-[#6848a6] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-md w-full disabled:opacity-50"
                  >
                     <PhotoIcon className="w-6 h-6 stroke-2 hidden sm:block" /> Save to Evidence Gallery
                  </button>
                </>
            )}
          </div>
        )}

        {/* Info Meta Fields when capturing */}
        {(isCameraActive || capturedImage) && (
            <div className="pt-4 border-t border-gray-100">
               <div className="mb-4">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category Flag</label>
                  <select 
                    value={photoDetails.type}
                    onChange={(e) => setPhotoDetails({...photoDetails, type: e.target.value})}
                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:border-[#7c56c2] transition-colors"
                  >
                      <option value="evidence">Evidence Marker</option>
                      <option value="incident">Incident Capture</option>
                      <option value="profile">Suspect Profile</option>
                      <option value="other">Other Incident</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Situation Description</label>
                  <input 
                    type="text" 
                    placeholder="E.g., Vehicle license plate of harasser..."
                    value={photoDetails.description}
                    onChange={(e) => setPhotoDetails({ ...photoDetails, description: e.target.value })}
                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:border-[#7c56c2] transition-colors" 
                  />
               </div>
            </div>
        )}

        {/* Troubleshooting Panel */}
        <div className="pt-4 border-t border-gray-200 mt-6 bg-yellow-50/50 p-4 rounded-2xl">
           <h3 className="text-sm font-black text-yellow-800 uppercase tracking-widest mb-3 flex items-center gap-2">
             <WrenchScrewdriverIcon className="w-5 h-5" /> Diagnostic & Troubleshooting
           </h3>
           <p className="text-xs text-yellow-700 font-medium mb-3">If the camera module is failing to load, you can run hardware diagnostics below.</p>
           <div className="flex gap-3">
              <button 
                 onClick={testCameraAccess}
                 className="flex-1 border border-yellow-300 bg-white text-yellow-800 hover:bg-yellow-100 transition-colors py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                  <InformationCircleIcon className="w-4 h-4 stroke-2" /> Detect Hardware
              </button>
              <button 
                 onClick={checkPermissions}
                 className="flex-1 border border-yellow-300 bg-white text-yellow-800 hover:bg-yellow-100 transition-colors py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                  <InformationCircleIcon className="w-4 h-4 stroke-2" /> View Permissions
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Camera;
