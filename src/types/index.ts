
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
  purchaseDate: Date;
  price: number;
  memo: string;
  createdAt: Date;
}
