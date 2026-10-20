import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site.config";

export default function NotFound() {
  return (
    <div className="py-24 md:py-36 text-center">
      <Container size="narrow" className="space-y-6">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#A65335]">
          404 &bull; Oasis Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#30251F]">
          Lost in the Desert Sands
        </h1>
        <p className="text-sm sm:text-base text-[#6B5D55] max-w-md mx-auto leading-relaxed">
          The dune or trail you are looking for does not exist or has shifted in the desert wind.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xs bg-[#30251F] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#F6EFE3] hover:bg-[#B88A44] transition-colors"
          >
            Return to {siteConfig.brand.name}
          </Link>
        </div>
      </Container>
    </div>
  );
}
