"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
    { name: "Craig", username: "@craig", body: "Mockly transformed my entire job search process.", img: "https://avatar.vercel.sh/jack" },
    { name: "Dhanush", username: "@dhanush", body: "The AI interview practice felt incredibly real", img: "https://avatar.vercel.sh/jill" },
    { name: "Cheryl", username: "@cheryl", body: "The resume feedback helped me land more interviews faster than ever.", img: "https://avatar.vercel.sh/john" },
    { name: "Ned", username: "@ned", body: "The online assessments helped me identify and fix my weak spots before the real interview.", img: "https://avatar.vercel.sh/jane" },
    { name: "Peter", username: "@Peter", body: "Mockly's ATS checker was the reason my resume finally got noticed.", img: "https://avatar.vercel.sh/jenny" },
    { name: "Marry Jane", username: "@Marry", body: "The real-time feedback from the AI interviewer was a total gamechanger for my communication skills.", img: "https://avatar.vercel.sh/james" },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

function ReviewCard({
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
}

const Testimonials = () => {
    return (
        <section className="bg-zinc-950 text-white relative">
            <div className="pointer-events-none absolute top-0/3 left-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35 z-10" />


            <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                    <span className="text-white">Testimonials</span>
                </h2>

                <div className="relative mt-12 flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:20s]">
                        {firstRow.map((r) => (
                            <ReviewCard key={r.username} {...r} />
                        ))}
                    </Marquee>

                    <Marquee reverse pauseOnHover className="[--duration:20s]">
                        {secondRow.map((r) => (
                            <ReviewCard key={r.username} {...r} />
                        ))}
                    </Marquee>

                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-zinc-950"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-zinc-950"></div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
