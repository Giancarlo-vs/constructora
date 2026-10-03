import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const LINEAS = ['Obras civiles', 'Consultoría y laboratorio', 'Tecnología'] as const;

export const ICONOS = [
  'tierra',
  'via',
  'puente',
  'edificio',
  'redes',
  'interventoria',
  'perforacion',
  'laboratorio',
  'codigo',
] as const;
export type IconoServicio = (typeof ICONOS)[number];

export const CATEGORIAS = [
  'Vías',
  'Puentes y contención',
  'Edificaciones',
  'Escenarios deportivos',
  'Urbanismo y redes',
  'Estudios y laboratorio',
] as const;

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    linea: z.enum(LINEAS),
    icono: z.enum(ICONOS),
    incluye: z.array(z.string()).default([]),
    orden: z.number().default(0),
    // Traducción al inglés (opcional). Si falta, la versión en inglés muestra el español.
    en: z
      .object({
        titulo: z.string(),
        resumen: z.string(),
        incluye: z.array(z.string()).optional(),
        descripcion: z.string().optional(),
      })
      .optional(),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      resumen: z.string(),
      categoria: z.enum(CATEGORIAS),
      ubicacion: z.string().optional(),
      anio: z.number().int().optional(),
      cliente: z.string().optional(),
      alcance: z.array(z.string()).default([]),
      destacado: z.boolean().default(false),
      orden: z.number().default(0),
      // Traducción al inglés (opcional). Si falta, la versión en inglés muestra el español.
      en: z
        .object({
          titulo: z.string(),
          resumen: z.string(),
          alcance: z.array(z.string()).optional(),
          cliente: z.string().optional(),
          descripcion: z.string().optional(),
        })
        .optional(),
      // Fotos opcionales: si no hay portada se muestra una ilustración de estratos.
      portada: image().optional(),
      galeria: z.array(image()).default([]),
    }),
});

export const collections = { servicios, proyectos };
