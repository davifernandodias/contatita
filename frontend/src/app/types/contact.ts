import { Phone } from "./phone";

export interface Contact {
  nome: string;
  idade: number;
  telefones: Phone[];
}