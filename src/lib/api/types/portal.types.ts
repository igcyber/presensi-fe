export interface PortalMenuPublic {
  id: number;
  nama: string;
  url: string;
  children?: PortalMenuPublic[];
}
