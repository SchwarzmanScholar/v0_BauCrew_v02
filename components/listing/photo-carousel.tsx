"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface PhotoCarouselProps {
  photos: string[]
  title: string
}

export function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = () => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }

  return (
    <div className="space-y-3">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0" onPointerUp={onSelect}>
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`${title} - Bild ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 bg-background/80 hover:bg-background" />
        <CarouselNext className="right-3 bg-background/80 hover:bg-background" />
      </Carousel>

      {/* Thumbnail dots */}
      <div className="flex items-center justify-center gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              current === index ? "bg-primary" : "bg-muted-foreground/30",
            )}
            aria-label={`Gehe zu Bild ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
