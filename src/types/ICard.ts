import IBase from "./IBase";

export enum CardStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
}

export type ICardData = IBase & {
  title: string;
  content: string;
  createdBy: string;
  categories: string;
  status: CardStatus;
  dueDate: Date;
};
