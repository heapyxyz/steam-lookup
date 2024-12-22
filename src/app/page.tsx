"use client"

import Image from "next/image"
import React from "react"
import { Center } from "@/src/components/center"
import { ResolveForm } from "@/src/components/resolve-form"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <Center
        style={{
          backgroundImage:
            "url(https://steamcommunity-a.akamaihd.net/public/images/profile/2020/bg_dots.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="flex flex-row items-center space-x-3 drop-shadow-background">
          <Image src="/icon-dark.png" width={96} height={96} alt="Logo" />

          <div>
            <p className="font-black text-5xl leading-none">SteamLookup</p>

            <div className="flex flex-row space-x-1 font-bold">
              <p>Made by</p>

              <Link
                href="https://github.com/heapyxyz"
                target="_blank"
                className="transition-opacity opacity-60 hover:opacity-90"
              >
                heapy
              </Link>
            </div>
          </div>
        </div>

        <ResolveForm />
      </Center>
    </>
  )
}
