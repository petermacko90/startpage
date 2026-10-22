export type Link = {
  id: string;
  customIconId: string | null;
  emoji: string | null;
  title: string;
  url: string;
  order: number;
};

export type Category = {
  id: string;
  customIconId: string | null;
  title: string;
  links: Link[];
  order: number;
};

export type State = {
  categories: Category[];
  undoState?: Category[];
};
