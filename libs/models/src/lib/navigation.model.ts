export interface Link {
  label: string;
  path: string;
  description?: string;
  children?: Link[];
}
