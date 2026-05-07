import { Link } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";

interface CollectionCardProps {
  title: string;
  description: string;
  handle: string;
  imageSlotName: string;
  motif: string;
  src?: string;
}

interface CollectionCardGridProps {
  collections: CollectionCardProps[];
}

export function CollectionCard({ title, description, handle, imageSlotName, motif, src }: CollectionCardProps) {
  return (
    <Link to="/collections/$handle" params={{ handle }} className="group block">
      <ImageSlot
        name={imageSlotName}
        ratio="3/4"
        src={src}
        motif={motif}
        alt={title}
        variant="warm"
        className="mb-4"
      />
      <h3 className="font-serif text-xl mb-1 group-hover:text-walnut transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <span className="text-sm font-medium text-cta">Udforsk →</span>
    </Link>
  );
}

export function CollectionCardGrid({ collections }: CollectionCardGridProps) {
  return (
    <section className="section-padding">
      <div className="container-calm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <CollectionCard key={col.handle} {...col} />
          ))}
        </div>
      </div>
    </section>
  );
}
