
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedContent } from '../types';
import { CopyIcon, DownloadIcon } from './IconComponents';

interface ResultsStepProps {
  videoUrl: string;
  content: GeneratedContent;
  onReset: () => void;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const parseVTTTimeToSeconds = (time: string): number => {
    const parts = time.split(':');
    let seconds = 0;
    if (parts.length === 3) {
        seconds += parseInt(parts[0], 10) * 3600;
        seconds += parseInt(parts[1], 10) * 60;
        seconds += parseFloat(parts[2].replace(',', '.'));
    } else {
        seconds += parseInt(parts[0], 10) * 60;
        seconds += parseFloat(parts[1].replace(',', '.'));
    }
    return seconds;
};

const parseVTT = (vttContent: string): { start: number; end: number; text: string }[] => {
    if (!vttContent || typeof vttContent !== 'string') return [];
    
    const cleanContent = vttContent.replace(/\r\n/g, '\n').replace(/^WEBVTT\s*/, '');
    const cues = [];
    const blocks = cleanContent.split('\n\n');

    for (const block of blocks) {
        if (!block.trim()) continue;
        const lines = block.split('\n');
        
        let timeLineIndex = lines.findIndex(line => line.includes('-->'));
        if (timeLineIndex === -1) continue;

        const [startStr, endStr] = lines[timeLineIndex].split(' --> ');
        if (!startStr || !endStr) continue;

        const text = lines.slice(timeLineIndex + 1).join('\n').trim();
        if (!text) continue;
        
        try {
            const start = parseVTTTimeToSeconds(startStr.trim());
            const end = parseVTTTimeToSeconds(endStr.trim().split(' ')[0]);
            cues.push({ start, end, text });
        } catch (e) {
            console.error("Falha ao analisar o tempo VTT:", startStr, endStr);
        }
    }
    return cues;
};


const ResultCard: React.FC<{ title: string; children: React.ReactNode; copyText?: string }> = ({ title, children, copyText }) => (
    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700/50 relative">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-yellow-400">{title}</h3>
            {copyText && (
                <button 
                    onClick={() => copyToClipboard(copyText)}
                    className="p-1.5 rounded-md hover:bg-blue-700 transition-colors"
                    title="Copiar"
                >
                    <CopyIcon />
                </button>
            )}
        </div>
        {children}
    </div>
);


const ResultsStep: React.FC<ResultsStepProps> = ({ videoUrl, content, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [parsedCues, setParsedCues] = useState<{ start: number; end: number; text: string }[]>([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (content.subtitles) {
      const cues = parseVTT(content.subtitles);
      setParsedCues(cues);

      const vttBlob = new Blob([content.subtitles], { type: 'text/vtt' });
      const url = URL.createObjectURL(vttBlob);
      setSubtitleUrl(url);

      return () => {
          URL.revokeObjectURL(url);
          setSubtitleUrl(null);
      }
    }
  }, [content.subtitles]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || parsedCues.length === 0) return;

    const handleTimeUpdate = () => {
        const currentTime = video.currentTime;
        const activeCue = parsedCues.find(cue => currentTime >= cue.start && currentTime <= cue.end);
        setCurrentCaption(activeCue ? activeCue.text : '');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [parsedCues]);


  const handleDownload = () => {
    alert("Funcionalidade de download simulada. Em uma aplicação real, aqui você baixaria o vídeo processado com as legendas embutidas.");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center lg:text-left">Pré-visualização do Vídeo</h2>
          <div className="relative">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              crossOrigin="anonymous"
              className="w-full rounded-lg shadow-2xl border-2 border-yellow-500/50"
            >
              {subtitleUrl && (
                  <track
                      src={subtitleUrl}
                      kind="subtitles"
                      srcLang="pt"
                      label="Português"
                      default
                  />
              )}
            </video>
            {currentCaption && (
              <div className="absolute bottom-[15%] sm:bottom-[12%] left-1/2 -translate-x-1/2 w-11/12 text-center pointer-events-none animate-fade-in">
                <p 
                  className="text-2xl lg:text-3xl font-bold text-white bg-black/60 rounded-md px-4 py-2 inline" 
                  style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}
                >
                  {currentCaption}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
           <ResultCard title="Título Sugerido" copyText={content.title}>
              <p className="text-blue-200">{content.title}</p>
          </ResultCard>
          <ResultCard title="Hashtags Sugeridas" copyText={content.hashtags.join(' ')}>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, index) => (
                  <span key={index} className="bg-blue-700 text-yellow-300 text-sm font-medium px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
          </ResultCard>
        </div>
      </div>

      <ResultCard title="Descrição Sugerida" copyText={content.description}>
          <p className="text-blue-200 whitespace-pre-wrap">{content.description}</p>
      </ResultCard>
      
      <ResultCard title="Legendas Geradas (formato VTT)" copyText={content.subtitles}>
        <div className="h-40 overflow-y-auto bg-blue-900/30 p-3 rounded-md border border-blue-700">
           <p className="text-blue-300 whitespace-pre-wrap font-mono text-xs">{content.subtitles}</p>
        </div>
      </ResultCard>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-[#0a192f] font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <DownloadIcon />
          Baixar Vídeo Final
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Processar Outro Vídeo
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
