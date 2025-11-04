
import React, { useState } from 'react';
import { WatermarkRemovalOption } from '../types';
import { BlurIcon, CropIcon, CoverIcon } from './IconComponents';

interface WatermarkStepProps {
  onProcess: (option: WatermarkRemovalOption) => void;
}

const WatermarkStep: React.FC<WatermarkStepProps> = ({ onProcess }) => {
  const [selectedOption, setSelectedOption] = useState<WatermarkRemovalOption>('none');

  const options = [
    { id: 'none', name: 'Nenhuma', icon: null },
    { id: 'blur', name: 'Desfoque (Blur)', icon: <BlurIcon /> },
    { id: 'crop', name: 'Recorte (Crop)', icon: <CropIcon /> },
    { id: 'cover', name: 'Cobrir', icon: <CoverIcon /> },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <h3 className="text-xl font-semibold text-yellow-400">1. Remoção de Marca D'água (Opcional)</h3>
      <p className="text-blue-300 max-w-lg mx-auto">
        Selecione uma técnica para remoção de marca d'água. Esta é uma simulação de processamento para fins demonstrativos.
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

      <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg text-sm mt-6">
        <strong>Aviso de Uso Ético:</strong> Certifique-se de que você possui os direitos para editar este vídeo. O uso indevido de conteúdo protegido por direitos autorais é de sua inteira responsabilidade.
      </div>

      <div className="pt-4">
        <button
          onClick={() => onProcess(selectedOption)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Próximo Passo
        </button>
      </div>
    </div>
  );
};

export default WatermarkStep;
