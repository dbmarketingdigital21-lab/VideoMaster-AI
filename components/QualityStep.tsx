
import React, { useState } from 'react';
import { QualityOption } from '../types';
import { ResolutionIcon, SharpenIcon, ColorIcon } from './IconComponents';

interface QualityStepProps {
  onProcess: (option: QualityOption) => void;
}

const QualityStep: React.FC<QualityStepProps> = ({ onProcess }) => {
  const [selectedOption, setSelectedOption] = useState<QualityOption>('none');

  const options = [
    { id: 'none', name: 'Nenhuma', icon: null },
    { id: 'upscale', name: 'Resolução (HD)', icon: <ResolutionIcon /> },
    { id: 'sharpen', name: 'Nitidez', icon: <SharpenIcon /> },
    { id: 'color_correction', name: 'Cores', icon: <ColorIcon /> },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <h3 className="text-xl font-semibold text-yellow-400">1. Melhoria de Qualidade (Opcional)</h3>
      <p className="text-blue-300 max-w-lg mx-auto">
        Selecione uma opção para melhorar a qualidade visual do seu vídeo. Esta também é uma simulação.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedOption(opt.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 h-32
              ${selectedOption === opt.id ? 'bg-blue-700 border-yellow-400' : 'bg-blue-900/50 border-blue-700 hover:border-blue-500'}`}
          >
            {opt.icon}
            <span className="font-semibold text-blue-200">{opt.name}</span>
          </button>
        ))}
      </div>

       <div className="pt-8">
        <button
          onClick={() => onProcess(selectedOption)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-[#0a192f] font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Analisar Vídeo e Gerar Conteúdo
        </button>
      </div>
    </div>
  );
};

export default QualityStep;
