import { getCollection } from 'astro:content';

/** Rutas estáticas compartidas por /proyectos/[id] y /en/projects/[id]. */
export async function rutasProyectos() {
  const proyectos = await getCollection('proyectos');
  return proyectos.map((proyecto) => ({ params: { id: proyecto.id }, props: { proyecto, todos: proyectos } }));
}
