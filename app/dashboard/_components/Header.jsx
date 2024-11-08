"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export const Header = () => {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  });
  return (
    <div className="flex items-center justify-between p-4 shadow-sm bg-secondary">
      <UserButton />
    </div>
  );
};
