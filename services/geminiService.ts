import { GoogleGenAI, Type } from '@google/genai';
import { GeneratedContent } from '../types';
import { MODEL_NAME } from '../constants';

// Fix: Per Gemini API guidelines, API key should be passed directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      mimeType: file.type,
      data,
    },
  };
};


export const generateVideoMetadata = async (
  videoFile: File
): Promise<GeneratedContent> => {
  try {
    const videoPart = await fileToGenerativePart(videoFile);
    
    // Fix: Per Gemini API guidelines, for single-turn requests, `contents` should be an object, not an array.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
          parts: [
            {
              text: `Você receberá um vídeo. Sua primeira e mais importante tarefa é transcrever o áudio do vídeo com precisão para o português.
              
Depois de ter a transcrição completa, use-a para gerar o seguinte conteúdo otimizado para redes sociais (YouTube, Instagram, TikTok).

**Sua tarefa é retornar um objeto JSON com os seguintes campos:**
- "title": Um título atrativo e curto (máximo 70 caracteres).
- "description": Uma descrição completa e otimizada para SEO (entre 200 e 300 palavras), usando parágrafos.
- "hashtags": Uma lista com exatamente 10 hashtags relevantes em formato de array de strings (ex: ["#hashtag1", "#hashtag2"]).
- "subtitles": A transcrição completa do áudio, formatada como um arquivo de legendas WebVTT (VTT). **IMPORTANTE: Divida as legendas em frases curtas e dinâmicas, como as vistas em Instagram Reels ou TikTok, para uma melhor experiência de visualização.** O formato deve seguir estritamente o padrão VTT, incluindo timestamps. Exemplo de formato:
WEBVTT

00:00:01.500 --> 00:00:03.000
Aprimore seus vídeos

00:00:03.200 --> 00:00:05.100
com o poder da IA.`
            },
            videoPart
          ],
        },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            subtitles: { type: Type.STRING },
          },
          required: ['title', 'description', 'hashtags', 'subtitles'],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedContent = JSON.parse(jsonText);
    
    // Ensure hashtags array has the '#' prefix
    parsedContent.hashtags = parsedContent.hashtags.map((tag: string) => 
      tag.startsWith('#') ? tag : `#${tag}`
    );

    return parsedContent as GeneratedContent;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Falha ao gerar metadados do vídeo.');
  }
};
