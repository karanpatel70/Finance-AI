"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="pb-20 px-4">
      <div>
        <h1>
          Manage Your Finance <br /> with Intelligence
          <p>
            An AI-powered financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
          </p>
          <div>
            <Link href="/dashboard">
              <Button size="lg" clasName="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="www.google.com">
              <Button size="lg" variant='outline' clasName="px-8">
               Watch Demo
              </Button>
            </Link>
          </div>
          <div>
            <div>
                <Image src="/banner.jpeg"
                width={1200}
                height={720}
                alt="Dashboard Preview"
                />
            </div>
          </div>
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
