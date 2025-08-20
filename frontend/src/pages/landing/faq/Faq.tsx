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
                                        Mockly is a complete online interview preparation platform. It helps you get hired by optimizing your resume with an ATS checker, sharpening your skills with realistic AI interviews and feedback, and preparing you for tests with online assessments.
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-2"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium">Pricing</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        Mockly offers several subscription tiers to fit your needs, from a basic plan with limited access to a premium plan that includes unlimited AI interviews and comprehensive feedback. You can view all our available plans and their features on our dedicated pricing page.
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
                                        As a digital service, Mockly doesn't have a traditional return policy like a physical good. Instead, it would have a refund policy.
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
                                        As a digital service, Mockly does not have a traditional product warranty. Instead, we are committed to your satisfaction. We offer a money-back guarantee if you are not satisfied with our service within a specified period of your first purchase. For details on our refund policy, please refer to our full Terms of Service.
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-6"
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="px-5 py-4 text-left text-zinc-100 hover:no-underline data-[state=open]:bg-zinc-900/60">
                                <span className="text-base md:text-lg font-medium"> Technical Requirements</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-zinc-300 leading-relaxed">
                                <div className="flex flex-col gap-4 text-balance">
                                    <p>
                                        To use Mockly, you need a stable internet connection, a modern web browser and a microphone. These are required for the AI interview feature and other tools, which are accessible on most laptops and desktop computers.
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
