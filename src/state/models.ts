export type Link = {
  id: string;
  icon: string;
  title: string;
  url: string;
  order: number;
};

export type Category = {
  id: string;
  icon: string;
  title: string;
  links: Link[];
  order: number;
};

export type State = {
  categories: Category[];
  undoState?: Category[];
};
