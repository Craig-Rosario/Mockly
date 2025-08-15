"use client";

import { Globe } from "@/components/magicui/globe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="bg-zinc-950 text-white ">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="relative mx-auto h-[420px] w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <span className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 bg-gradient-to-b from-white to-zinc-300/70 bg-clip-text text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                Global Reach
              </span>
              <Globe className="absolute left-1/2 top-24 -translate-x-1/2" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.25),rgba(255,255,255,0))]" />
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Get In Touch</h2>
            <p className="mt-3 max-w-lg text-zinc-400">
              A good design isn't just pretty—it works. Tell us what you need and we'll get back to you.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@domain.com"
                  required
                  className="border-zinc-800 bg-zinc-900/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  className="border-zinc-800 bg-zinc-900/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Drop the details here…"
                  className="border-zinc-800 bg-zinc-900/60"
                />
              </div>

              <Button
                className="mt-2 text-white rounded-xl px-6 py-5 font-medium bg-gradient-to-r from-[#5FA4E6] to-[#BA2193] hover:opacity-90"
              >
                Get in Touch
              </Button>
            </form>
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-900 bg-zinc-950/95">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">MOCKLY</h3>
              <p className="mt-3 max-w-sm text-sm text-zinc-400">
                Your AI-powered prep for interviews and assessments. Upload your docs, practice with AI, and show up ready.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">Sections</h4>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                  <li><a href="#faq" className="hover:text-white">FAQs</a></li>
                  <li><a href="#contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">Product</h4>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-white">Login</a></li>
                  <li><a href="#" className="hover:text-white">Dashboard</a></li>
                  <li><a href="#" className="hover:text-white">Changelog</a></li>
                  <li><a href="#" className="hover:text-white">Status</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-zinc-900 pt-6 md:flex-row">
            <p className="text-xs text-zinc-500">© 2025 CGBAT. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800">
                <Facebook className="h-4 w-4 text-zinc-300" />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800">
                <Twitter className="h-4 w-4 text-zinc-300" />
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800">
                <Linkedin className="h-4 w-4 text-zinc-300" />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800">
                <Instagram className="h-4 w-4 text-zinc-300" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
