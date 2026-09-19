export type Link = {
  id: string;
  icon: string;
  text: string;
  url: string;
  order: number;
};

export type Category = {
  id: string;
  icon: string;
  title: string;
  items: Link[];
  order: number;
};

export type CategoryRecord = Record<Category["id"], Category>;

export type State = {
  categories: CategoryRecord;
  undoState?: CategoryRecord;
};
