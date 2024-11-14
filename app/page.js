"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="p-8 text-center transition-transform duration-300 bg-white shadow-lg bg-opacity-95 md:p-12 rounded-2xl backdrop-blur-sm hover:transform hover:-translate-y-1">
        <h1 className="mb-8 text-2xl font-semibold text-gray-800">Welcome!</h1>
        <div className="flex justify-center gap-4">
          <Link href={"/sign-in"}>
            <button className="px-6 py-3 font-medium text-white transition-all duration-300 transform bg-purple-800 rounded-lg shadow-md hover:bg-purple-900 hover:-translate-y-1">
              Login
            </button>
          </Link>
          <Link href={"/sign-up"}>
            <button className="px-6 py-3 font-medium text-white transition-all duration-300 transform bg-green-600 rounded-lg shadow-md hover:bg-green-700 hover:-translate-y-1">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
