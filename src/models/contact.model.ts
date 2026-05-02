export interface IContactItem {
  id: number;
  value: string;
  link: string | null;
  displayOrder: number;
}

export interface IContactCategory {
  id: number;
  title: string;
  displayOrder: number;
  items: IContactItem[];
}
