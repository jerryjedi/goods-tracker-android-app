
export interface Classification {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  classificationId: string;
  photoUrl?: string;
  photoData?: string; // Base64 encoded image data for persistence
  purchaseDate?: Date | null;
  price?: number | null;
  memo: string;
  createdAt: Date;
}

export interface FileWithPreview extends File {
  preview: string;
}

export interface ExportOptions {
  includePhotos: boolean;
  format: 'markdown';
}
