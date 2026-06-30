import { prisma } from "@/lib/prisma";
import { buildAccessPath } from "@/lib/slug";
import { buildCountdownPageData } from "@/lib/person-data";
import { PublicHomeViewer } from "@/components/PublicHomeViewer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      relationType: true,
      slug: true,
      accessToken: true,
    },
  });

  const personItems = persons.map((p) => ({
    id: p.id,
    name: p.name,
    relationType: p.relationType,
    accessPath: buildAccessPath(p.slug, p.accessToken),
  }));

  const initialPreview =
    persons.length > 0
      ? await buildCountdownPageData(persons[0].id)
      : null;

  return (
    <PublicHomeViewer
      persons={personItems}
      initialPreview={initialPreview}
    />
  );
}
