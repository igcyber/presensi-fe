export interface MenuPublic {
  id: number;
  nama: string;
  url: string;
  children?: MenuPublic[];
}
