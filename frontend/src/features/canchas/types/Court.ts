import type { SportFilter } from "./SportFilter";

export interface Court {
  id: number;
  nombre: string;
  deporte: SportFilter;
  descripcion: string;
  precio: number;
  precioFinde: number;
  capacidad: string;
  superficie: string;
  techada: boolean;
  imagen: string;
  disponible: boolean;
  destacada: boolean;
  amenidades: string[];
}