import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  return (
    <div className="fixed top-0">
      <nav>
        <Link href="/">
        <Image src={"/logo.png"} alt="Product-logo" width={200} height={60} className="h-12 w-auto object-contain" />

        </Link>
      </nav>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Header;
