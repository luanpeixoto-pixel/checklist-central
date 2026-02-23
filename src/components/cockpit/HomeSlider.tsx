import { useHomeSlides } from "@/hooks/useHomeSlides";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export const HomeSlider = () => {
  const { activeSlides, loading } = useHomeSlides();

  if (loading || activeSlides.length === 0) return null;

  const handleClick = (url: string | null) => {
    if (url) {
      const normalized = url.startsWith("http") ? url : `https://${url}`;
      window.open(normalized, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mb-8">
      <Carousel
        opts={{
          align: "start",
          loop: activeSlides.length > 2,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {activeSlides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="pl-4 basis-full sm:basis-1/2"
            >
              <div
                onClick={() => handleClick(slide.redirect_url)}
                className={`relative rounded-xl overflow-hidden aspect-[16/7] bg-muted ${
                  slide.redirect_url ? "cursor-pointer" : ""
                }`}
              >
                <img
                  src={slide.image_url}
                  alt="Banner"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {activeSlides.length > 2 && (
          <>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
};
