
import React, { useState, useEffect } from 'react';
import { Spinner } from './IconComponents';
import { QualityOption } from '../types';

interface ProcessingStepProps {
  qualityOption: QualityOption;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ qualityOption }) => {
    
    const initialSteps = [
        "Analisando o vídeo...",
    ];

    if (qualityOption !== 'none') {
        initialSteps.push("Melhorando a qualidade do vídeo (simulação)...");
    }
    
    initialSteps.push("Transcrevendo o áudio com IA...");

    const finalSteps = [
        "Gerando conteúdo para redes sociais...",
        "Preparando os resultados...",
    ];

    const steps = [...initialSteps, ...finalSteps];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1800);

        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-fade-in min-h-[400px]">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Processando seu vídeo</h2>
            <div className="w-full max-w-md space-y-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg transition-all duration-500 ${
                            index <= currentStep ? 'bg-blue-800/50 opacity-100' : 'opacity-40'
                        }`}
                    >
                        <div className="w-6 h-6 mr-4 flex-shrink-0">
                           {index <= currentStep && <Spinner />}
                        </div>
                        <span className="text-blue-200">{step}</span>
                    </div>
                ))}
            </div>
             <p className="mt-8 text-blue-300">Isso pode levar alguns instantes. Estamos usando a magia da IA!</p>
        </div>
    );
};

export default ProcessingStep;