import React, { useState } from 'react';

const sizeLimit = 1048576; // 1MB

export function FileUploadModal({
  isVisible = false,
  onClose,
  onSubmit,
  title = "Subir archivo",
  accept = ".csv",
  maxFileSize = sizeLimit,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (!isVisible) return null;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filesWithData = files.map((file, index) => ({
      id: index,
      file_name: file.name.replace(/\.(csv|shp|kml|parquet)/, ''),
      fileData: file,
    }));
    setSelectedFiles(filesWithData);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(event.dataTransfer.files);
    handleFileChange({ target: { files: newFiles } });
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = () => {
    const file = selectedFiles[0]?.fileData;
    if (!file) return;

    if (file.size > maxFileSize) {
      alert("El archivo es muy grande, máximo 1MB");
      return;
    }

    onSubmit?.(file);
    setSelectedFiles([]);
  };

  return (
    <div className="absolute z-[1000] w-screen h-screen flex justify-center items-start pt-[10%]">
      <span className="absolute inset-0 bg-gray-300/50 w-full h-full"></span>
      <div className="relative z-10 flex flex-col gap-4 bg-white rounded border border-gray-400 shadow-xl p-4 min-w-[320px]">
        <h1 className="text-[16px] font-bold">{title}</h1>

        <div
          className={`${isDragging ? "bg-gray-200" : "bg-white"} w-full min-h-[60px] rounded-md border border-dashed border-gray-300 text-center flex flex-col items-center justify-center p-4 transition-colors`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <input
            onChangeCapture={handleFileChange}
            id="file-upload"
            type="file"
            accept={accept}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {selectedFiles[0]?.file_name || "Seleccioná o arrastrá el archivo acá"}
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpload}
            disabled={!selectedFiles[0]}
            className={`px-4 py-2 rounded ${
              selectedFiles[0]
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Subir
          </button>
          <button
            onClick={() => {
              setSelectedFiles([]);
              onClose?.();
            }}
            className="px-4 py-2 rounded text-sky-500 hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
