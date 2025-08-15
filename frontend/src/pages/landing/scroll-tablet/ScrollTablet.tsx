import MocklyDashboard from '@/assets/images/Mockly Dashboard.png'
"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function ScrollTablet() {
  return (
    <div className="flex flex-col relative">
      <div className="pointer-events-none absolute top-1/4 right-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />

      <div className="pointer-events-none absolute top-1/3 left-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />

      <div className="pointer-events-none absolute top-2/3 left-2/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-45" />
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Say Goodbye To <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Being Unready
              </span>
            </h1>
          </>
        }
      >
        <img
          src={MocklyDashboard}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
