
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
  purchaseDate?: Date | null;
  price?: number | null;
  memo: string;
  createdAt: Date;
}

export interface FileWithPreview extends File {
  preview: string;
}
