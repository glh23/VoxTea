import React, { useState } from "react";

const DragNdrop = ({ onFileSelect }) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      style={{ marginTop: "10px", padding: "10px", border: "2px dashed #ccc", borderRadius: "8px", textAlign: "center" }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div>
        <p>Drag & Drop a file here</p>
        <label>
          Or select a file
          <input type="file" className="hidden" onChange={handleFileChange} accept="audio/mp3" />
        </label>
      </div>
    </div>
  );
};

export default DragNdrop;
