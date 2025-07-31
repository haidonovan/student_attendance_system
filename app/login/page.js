// login folder in app -> page.js

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/loginForm/login-form"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"


export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left: Login Panel */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right: Full Background Carousel */}
      <div className="hidden lg:block h-full w-full">
        <Carousel className="h-full w-full">
          <CarouselContent className="h-full">
            {[
              "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?fit=crop&w=1000&h=1000&q=80", // grayscale person
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=1000&h=1000&q=80", // grayscale woman portrait
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=crop&w=1000&h=1000&q=80", // grayscale kid
            ].map((src, index) => (
              <CarouselItem
                key={index}
                className="h-full w-full flex items-center justify-center"
              >
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-auto object-cover grayscale"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

    </div>
  )
}




// IDEAL

// import { GalleryVerticalEnd } from "lucide-react"
// import { LoginForm } from "@/components/loginForm/login-form"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel"

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen">
//       {/* Left: Login Panel */}
//       <div className="flex flex-col w-full max-w-lg p-6 md:p-10 z-10 relative bg-white">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <a href="#" className="flex items-center gap-2 font-medium">
//             <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
//               <GalleryVerticalEnd className="size-4" />
//             </div>
//             Acme Inc.
//           </a>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs">
//             <LoginForm />
//           </div>
//         </div>
//       </div>

//       {/* Right: Full height carousel */}
//       <div className="hidden lg:flex flex-1 relative">
//         <Carousel className="w-full h-full">
//           <CarouselContent className="w-full h-full">
//             {[
//               "https://images.unsplash.com/photo-1577896851231-70ef18881754?fit=crop&w=1920&q=80",
//               "https://images.unsplash.com/photo-1523240795612-9a054b0db644?fit=crop&w=1920&q=80",
//               "https://images.unsplash.com/photo-1531497865144-0464ef8fbf0c?fit=crop&w=1920&q=80",
//             ].map((src, index) => (
//               <CarouselItem key={index} className="relative w-full h-screen">
//                 <img
//                   src={src}
//                   alt={`Slide ${index + 1}`}
//                   className="absolute inset-0 w-full h-full object-cover grayscale"
//                 />
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//         </Carousel>
//       </div>
//     </div>
//   )
// }
