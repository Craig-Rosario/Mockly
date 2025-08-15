"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from '@fortawesome/free-solid-svg-icons'
import {Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";


const Pricing = () => {
    return (
        <section id="pricing" className="bg-zinc-950 text-white">
            <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                    <span className="text-white">Pricing</span>
                </h2>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6
                       hover:bg-zinc-900/60 transition-colors min-h-[220px] text-center"
                    >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center
                            rounded-xl bg-zinc-800/70 ring-1 ring-zinc-700">
                            <FontAwesomeIcon
                                icon={faGem}
                                size="2x"
                                className="text-gray-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100">Silver Package</h3>
                        <Separator className="my-4 bg-zinc-700" />
                        <ul className="mt-4 text-lg leading-6 text-zinc-300 space-y-4 text-left">
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>Upload 1 Resume/CV per week</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>1 Company-specific MCQ Test</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                                <span>AI Mock Interviews</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                                <span>Advanced Resume Scoring</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                                <span>Unlimited Interviews</span>
                            </li>
                        </ul>
                        <Separator className="my-4 bg-zinc-700" />
                        <div className="flex items-baseline gap-1">
                            <h2 className="font-bold text-4xl tracking-tight">₹Free</h2>
                            <span className="text-lg text-zinc-400">/mo</span>
                        </div>
                    </div>

                    <NeonGradientCard className="max-w-sm text-center rounded-2xl border border-zinc-800 bg-zinc-900/40">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/70 ring-1 ring-zinc-700">
                            <FontAwesomeIcon
                                icon={faGem}
                                size="2x"
                                className="text-yellow-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-zinc-100">Golden Package</h3>

                        <Separator className="my-4 bg-zinc-700" />

                        <ul className="mt-4 text-lg leading-6 text-zinc-300 space-y-4 text-left">
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>Upload up to 5 documents per week</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>Advanced Resume Scoring</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>3 Company-specific MCQ Tests</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>3 AI Mock Interviews</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                                <span>Unlimited Interviews</span>
                            </li>
                        </ul>

                        <Separator className="my-4 bg-zinc-700" />

                        <div className="flex items-baseline gap-1">
                            <h2 className="font-bold text-4xl tracking-tight">₹750</h2>
                            <span className="text-lg text-zinc-400">/mo</span>
                        </div>
                    </NeonGradientCard>

                    <div
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6
                       hover:bg-zinc-900/60 transition-colors min-h-[220px] text-center"
                    >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center
                            rounded-xl bg-zinc-800/70 ring-1 ring-zinc-700">
                            <FontAwesomeIcon
                                icon={faGem}
                                size="2x"
                                className="text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]"
                            />

                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100">Diamond Package</h3>
                        <Separator className="my-4 bg-zinc-700" />
                        <ul className="mt-4 text-lg leading-6 text-zinc-300 space-y-4 text-left">
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>Upload up to 10 documents per week</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>Advanced Resume Scoring</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>10 Company-specific MCQ Tests</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>10 AI Mock Interviews</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                <span>Unlimited Interviews</span>
                            </li>
                        </ul>
                        <Separator className="my-4 bg-zinc-700" />
                        <div className="flex items-baseline gap-1">
                            <h2 className="font-bold text-4xl tracking-tight">₹1500</h2>
                            <span className="text-lg text-zinc-400">/mo</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
