
import React, { useState, useCallback } from 'react';
import { AppState, GeneratedContent, QualityOption } from './types';
import { generateVideoMetadata } from './services/geminiService';
import UploadStep from './components/UploadStep';
import ProcessingStep from './components/ProcessingStep';
import ResultsStep from './components/ResultsStep';
import { LogoIcon } from './components/IconComponents';
import QualityStep from './components/QualityStep';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qualityOption, setQualityOption] = useState<QualityOption>('none');

  const handleFileChange = (file: File) => {
    setVideoFile(file);
    setError(null);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleStartProcessing = () => {
    if (!videoFile) {
      setError('Por favor, envie um arquivo de vídeo.');
      return;
    }
    setError(null);
    setAppState(AppState.QUALITY);
  };
  
  const handleQualitySelection = useCallback(async (option: QualityOption) => {
    if (!videoFile) {
      setError('Por favor, envie um arquivo de vídeo.');
      setAppState(AppState.UPLOAD);
      return;
    }
    setQualityOption(option);
    setError(null);
    setAppState(AppState.PROCESSING);

    try {
      const content = await generateVideoMetadata(videoFile);
      setGeneratedContent(content);
      setAppState(AppState.RESULTS);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao processar o vídeo. Tente novamente.');
      setAppState(AppState.UPLOAD);
    }
  }, [videoFile]);

  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setVideoFile(null);
    if(videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setGeneratedContent(null);
    setError(null);
    setQualityOption('none');
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.QUALITY:
        return <QualityStep onProcess={handleQualitySelection} />;
      case AppState.PROCESSING:
        return <ProcessingStep qualityOption={qualityOption} />;
      case AppState.RESULTS:
        return generatedContent && videoUrl && (
          <ResultsStep
            videoUrl={videoUrl}
            content={generatedContent}
            onReset={handleReset}
          />
        );
      case AppState.UPLOAD:
      default:
        return (
          <UploadStep
            onFileChange={handleFileChange}
            onProcess={handleStartProcessing}
            videoFile={videoFile}
            error={error}
          />
        );
    }
  };

  return (
    <div className="bg-[#0a192f] min-h-screen text-gray-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
             <LogoIcon />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">
              VideoMaster AI
            </h1>
          </div>
          <p className="text-lg text-blue-200">
            Aprimore seus vídeos com o poder da Inteligência Artificial
          </p>
        </header>
        <main className="bg-[#112240]/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-blue-800/50">
          {renderContent()}
        </main>
         <footer className="text-center mt-8 text-sm text-blue-400">
          <p>
            Desenvolvido para fins criativos e educacionais. Use com responsabilidade.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
