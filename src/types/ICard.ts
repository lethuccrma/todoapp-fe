import IBase from "./IBase";

export enum CardStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
}

export type ICardData = IBase & {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  category: string;
  status: CardStatus;
  dueDate: Date;
};
