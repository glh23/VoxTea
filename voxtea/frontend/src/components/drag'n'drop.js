import React, { useState } from 'react';

const DragNdrop = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div 
      style = {{marginTop: '10px', padding: '10px'}}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className="text-center">
          {selectedFile.type.startsWith('image') && (
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-24 h-24 mx-auto rounded-md mb-2" />
          )}
          <p>{selectedFile.name}</p>
          {selectedFile.type.startsWith('audio') && (
            <audio controls className="mx-auto">
              <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
              Your browser does not support the audio tag.
            </audio>
          )}
        </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-2">Drag & Drop a file here</p>
              <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition-all">
                Select File
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )
      }
        </div>
  );
};

export default DragNdrop;
