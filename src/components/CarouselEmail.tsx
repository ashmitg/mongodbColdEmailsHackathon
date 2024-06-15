
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselSpacing({result}) {
  console.log(result, "data within carousel")
  return (
    <Carousel className="w-[80rem] h-screen"> {/* Adjusted for full screen */}
      <CarouselContent className="m-5">
        {result && result.map((items, index) => (
          <CarouselItem key={index} className="p-5 md:basis-3/4 lg:basis-2/3">
            <div className="p-5 h-full flex items-center justify-center"> {/* Adjusted for centering and padding */}
              <Card className="w-full h-full"> {/* Adjusted for full width and height within the carousel item */}
                <CardContent className="flex flex-col items-center justify-center p-10 h-full">
                  <span className="text-4xl font-semibold mb-4"> Email {index + 1}</span> {/* Adjusted for larger text */}
                  {/* Sample email content */}
                  <div className="text-center">
                    {items.result}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}