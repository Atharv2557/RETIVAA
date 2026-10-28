import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { RoyalContactExperience } from "@/features/contact/components/RoyalContactExperience";

export const metadata: Metadata = {
  title: "Send a Note to the Desert | Contact RETIVAA DESERT CAMP",
  description: `Write a letter to ${siteConfig.brand.name} in the Thar Desert. Plan your luxury desert stay in Jaisalmer, Rajasthan.`,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#191918]">
      <RoyalContactExperience />
    </main>
  );
}
