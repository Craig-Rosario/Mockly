"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
    return (
        <section id="faq" className="bg-zinc-950 text-white  relative">
            <div className="pointer-events-none absolute top-0/3 right-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />
            <div className="pointer-events-none absolute top-1/3 left-0/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />
            <div className="pointer-events-none absolute top-2/3 left-2/3 w-80 h-80 bg-gradient-to-br from-[#5FA4E6] to-[#BA2193] rounded-full blur-[200px] opacity-35" />


            <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
                <div className="text-left">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        <span className="text-white">FAQs</span>
                    </h2>
                </div>

                <div className="mx-auto mt-10 w-full max-w-5xl">
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
                        className="grid grid-cols-1 md:grid-cols-1 gap-3"
                    >
                        <AccordionItem
                            value="item-1"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">Product Information</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        It's AI
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-2"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">Shipping Details</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        Written up bro
                                    </p>
                                    
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-3"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">Return Policy</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        LMAO
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-5"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">Warranty</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        Chal be
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-6"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">idk</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        kdi
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-4"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">How accurate are the AI recommendations?</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        Our AI has been trained on thousands of real-world examples to deliver reliable feedback. While no tool can guarantee results, our insights are designed to help you improve and stand out to employers.
                                    </p>
                                    <p>
                                        (lie)
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

            </div>
        </section>
    );
};

export default Faq;
