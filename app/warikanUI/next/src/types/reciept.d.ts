export type TReceiptItem = {
  name: string;
  price: number;
  quantity: number;
  reducedTax: boolean;
};

export type TReceipt = {
  id: number;
  register_date: string;
  totalAmount: number;
  imageUrl: string;
  createdBy: string;
  isUpdated: boolean;
  item: Array<TReceiptItem>;
};
