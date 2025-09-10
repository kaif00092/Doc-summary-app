import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const DocumentUpload = ({ onFileSelect, file, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // IMPORTANT: Updated this section to accept common image types
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    disabled,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <svg
        className="upload-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
        />
      </svg>
      <p className="dropzone-main-text">
        {file ? file.name : "Drag & Drop PDF or Image"}
      </p>
      {!file && <p className="dropzone-sub-text">Click to browse</p>}
    </div>
  );
};

export default DocumentUpload;
