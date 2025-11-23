import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  label: string;
  image: string | null;
  onImageChange: (img: string | null) => void;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, image, onImageChange, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error", err);
      alert("无法访问摄像头");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onImageChange(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const clearImage = () => {
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      
      {cameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] md:aspect-video shadow-lg">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
             <Button onClick={capturePhoto} variant="secondary" className="rounded-full w-14 h-14 p-0 flex items-center justify-center border-4 border-white">
                <div className="w-3 h-3 bg-white rounded-full"></div>
             </Button>
             <Button onClick={stopCamera} variant="ghost" className="bg-white/20 text-white hover:bg-white/40 backdrop-blur-md">
                取消
             </Button>
          </div>
        </div>
      ) : image ? (
        <div className="relative group rounded-2xl overflow-hidden shadow-md border border-gray-100 aspect-[3/4] md:aspect-video bg-gray-50">
          <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button onClick={clearImage} variant="ghost" className="text-white hover:text-red-400 hover:bg-white/10">
              <X className="w-8 h-8" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-6 md:p-10 transition-colors text-center cursor-pointer
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              {label.includes("参考") ? <ImageIcon className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">点击上传或拖拽图片</p>
              {description && <p className="text-xs text-gray-400">{description}</p>}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs mx-auto">
             <Button 
                type="button"
                variant="outline" 
                onClick={(e) => { e.stopPropagation(); startCamera(); }}
                icon={<Camera className="w-4 h-4" />}
                className="w-full"
              >
                拍照
              </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;