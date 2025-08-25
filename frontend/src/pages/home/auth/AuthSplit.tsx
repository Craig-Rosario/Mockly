"use client";
import { useState } from "react";
import { LoginForm } from "@/pages/home/login/login-form";
import { RegistrationForm } from "@/pages/home/registration/registration-form";

type AuthSplitProps = { initial?: "login" | "register" };

export default function AuthSplit({ initial = "login" }: AuthSplitProps) {
  const [mode, setMode] = useState<"login" | "register">(initial);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-black">
      
      <div className="absolute top-4 left-4 z-50 text-white font-bold text-lg">
        Mockly
      </div>

      
      <div className="relative w-full max-w-6xl min-h-[600px] bg-card rounded-2xl shadow-xl overflow-hidden flex">
        
        <div
          className={[
            "absolute top-0 h-full w-1/2 rounded-3xl bg-background/60 backdrop-blur shadow-lg transition-transform duration-500 ease-in-out pointer-events-none z-20",
            mode === "login" ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          aria-hidden
        />

        
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 grid place-items-center p-6 z-40">
          <div
            className={[
              "w-full max-w-sm transition-all duration-500",
              mode === "login"
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "-translate-x-full opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <LoginForm onSwitch={() => setMode("register")} />
          </div>
        </div>

        
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 grid place-items-center p-6 z-40">
          <div
            className={[
              "w-full max-w-sm transition-all duration-500",
              mode === "register"
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "translate-x-full opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <RegistrationForm onSwitch={() => setMode("login")} />
          </div>
        </div>

        
        <div className="absolute inset-y-0 right-0 hidden lg:block w-1/2 z-30">
          <img
            src="/placeholder.svg"
            alt="Side image"
            className={[
              "h-full w-full object-cover transition-opacity duration-500 dark:brightness-[0.2] dark:grayscale",
              mode === "register" ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}
