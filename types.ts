export interface GenerationConfig {
  userImage: string | null;
  refImage: string | null;
  prompt: string;
}

export interface GeneratedResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export enum DesignMode {
  AUTO = 'auto',
  CUSTOM = 'custom'
}