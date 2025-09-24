"use client";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useNavigate } from "react-router-dom";

export function AppLamp() {

    const navigate=useNavigate();
    return (
        <LampContainer>
            <motion.div
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                className="text-center"
            >
                <h1 className="py-4 text-4xl md:text-7xl font-semibold tracking-tight text-gray-300">
                    Overthink It Now{" "}
                    <br className="hidden sm:block" />
                    Not When It Matters.
                </h1>

                <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
                    Practice smarter with AI insights that help you go <br />
                    from unsure to ready.
                </p>


                <div className="mt-10 flex justify-center">
                    <InteractiveHoverButton aria-label="Get started" onClick={()=>navigate('/login')}>
                        Get Started
                    </InteractiveHoverButton>
                </div>
            </motion.div>
        </LampContainer>
    );
}
