import { ArrowLeft, GalleryVerticalEnd } from "lucide-react";
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b0b0b] to-[#121212] text-white relative">
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <ArrowLeft
          className="cursor-pointer hover:text-gray-300 transition"
          onClick={() => navigate("/")}
        />
        <div className="flex items-center gap-2 font-medium text-white">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Mockly
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/registration"
            afterSignInUrl="/dashboard"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
