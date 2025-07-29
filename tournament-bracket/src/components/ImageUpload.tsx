import React, { useCallback, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { TOURNAMENT_SIZE } from '../types/tournament';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  uploadedImages: File[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesSelected, uploadedImages }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      const newFiles = [...uploadedImages, ...files].slice(0, TOURNAMENT_SIZE);
      onImagesSelected(newFiles);
    }
  }, [uploadedImages, onImagesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      const newFiles = [...uploadedImages, ...files].slice(0, TOURNAMENT_SIZE);
      onImagesSelected(newFiles);
    }
  }, [uploadedImages, onImagesSelected]);

  const removeImage = useCallback((index: number) => {
    const newFiles = uploadedImages.filter((_, i) => i !== index);
    onImagesSelected(newFiles);
  }, [uploadedImages, onImagesSelected]);

  const clearAll = useCallback(() => {
    onImagesSelected([]);
  }, [onImagesSelected]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Tournament Images
        </h2>
        <p className="text-gray-600 mb-4">
          Upload exactly {TOURNAMENT_SIZE} images to create your tournament bracket. 
          Each image will represent a competitor in the tournament.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {uploadedImages.length} / {TOURNAMENT_SIZE} images uploaded
          </span>
          {uploadedImages.length > 0 && (
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedImages.length / TOURNAMENT_SIZE) * 100}%` }}
          />
        </div>
      </div>

      {uploadedImages.length < TOURNAMENT_SIZE && (
        <div 
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports PNG, JPG, GIF up to 10MB each
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Files
          </button>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Uploaded Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {uploadedImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
            
            {/* Placeholder slots */}
            {Array.from({ length: TOURNAMENT_SIZE - uploadedImages.length }).map((_, index) => (
              <div 
                key={`placeholder-${index}`}
                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
              >
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === TOURNAMENT_SIZE && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Perfect! You've uploaded all {TOURNAMENT_SIZE} images.
              </p>
              <p className="text-sm text-green-600">
                Ready to proceed with team assignment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;