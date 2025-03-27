"use client";

import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginModal
        isOpen={true}
        onClose={() => router.push("/")}
        onLogin={handleLoginSuccess}
        onSignupClick={() => router.push("/register")}
      />
    </div>
  );
}
