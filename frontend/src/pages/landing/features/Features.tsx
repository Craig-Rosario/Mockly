"use client";

import { File, CircleCheck, User, ChartColumnIncreasing } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShineBorder } from "@/components/magicui/shine-border";

const features = [
  {
    icon: File,
    title: "Resume Analysis",
    text: "Get instant feedback to highlight strengths and improve key sections.",
  },
  {
    icon: CircleCheck,
    title: "Mock MCQ Test",
    text: "Practice company-specific tests and measure readiness with confidence.",
  },
  // {
  //   icon: User,
  //   title: "AI Interviews",
  //   text: "Simulate interviews, record responses, and get actionable suggestions.",
  // },
  {
    icon: ChartColumnIncreasing,
    title: "Custom Metrics",
    text: "Track analytics and scores to focus on the highest-impact areas.",
  },
];

const Features = () => {
  return (
    <section id="features" className=" relative bg-zinc-950 text-white">
        <div className="pointer-events-none absolute top-0/3 left-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />

        <div className="pointer-events-none absolute top-3/3 right-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />

        
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-white">Features</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, text }) => {
            if (title === "Custom Metrics") {
              return (
                <Card
                  key={title}
                  className="relative overflow-hidden border border-zinc-800 bg-zinc-900/40 text-center min-h-[220px]"
                >
                  <ShineBorder shineColor={["#5FA4E6", "#BA2193", "#FFFFFF"]} />
                  <CardHeader className="relative z-10">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/70 ring-1 ring-zinc-700 mx-auto">
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      {text}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10" />
                  <CardFooter className="relative z-10" />
                </Card>
              );
            }

            return (
              <article
                key={title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6
                           hover:bg-zinc-900/60 transition-colors min-h-[220px]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center
                                rounded-xl bg-zinc-800/70 ring-1 ring-zinc-700">
                  <Icon className="h-6 w-6 text-zinc-200" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
