
import React, { useRef, useState } from 'react';
import { UploadIcon } from './IconComponents';

interface UploadStepProps {
  onFileChange: (file: File) => void;
  onProcess: () => void;
  videoFile: File | null;
  error: string | null;
}

const UploadStep: React.FC<UploadStepProps> = ({
  onFileChange,
  onProcess,
  videoFile,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Envie seu vídeo</h3>
        <p className="text-blue-300 mb-4 text-center max-w-md">
          A IA irá transcrever o áudio e gerar todo o conteúdo para suas redes sociais.
        </p>
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full max-w-lg h-48 border-2 border-dashed border-blue-600 rounded-lg cursor-pointer bg-blue-900/30 hover:bg-blue-900/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon />
            {videoFile ? (
              <p className="font-semibold text-green-400">{videoFile.name}</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-blue-300"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                <p className="text-xs text-blue-400">MP4, MOV ou WEBM</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".mp4,.mov,.webm"
            onChange={handleFileSelect}
          />
        </label>
      </div>
      
      <div className="flex items-center justify-center space-x-2 mt-4">
        <input
            id="author-confirm"
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
        />
        <label htmlFor="author-confirm" className="text-sm text-blue-300">
            Eu confirmo que sou o autor deste vídeo e possuo os direitos de uso.
        </label>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onProcess}
          disabled={!videoFile || !isConfirmed}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:from-blue-500"
        >
          Próximo Passo
        </button>
      </div>
    </div>
  );
};

export default UploadStep;