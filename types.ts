export enum AppState {
  UPLOAD,
  QUALITY,
  PROCESSING,
  RESULTS,
}

export type QualityOption = 'none' | 'upscale' | 'sharpen' | 'color_correction';

// Fix: Add missing WatermarkRemovalOption type
export type WatermarkRemovalOption = 'none' | 'blur' | 'crop' | 'cover';

export interface GeneratedContent {
  title: string;
  description: string;
  hashtags: string[];
  subtitles: string;
}
