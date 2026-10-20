import Image, { type ImageProps } from "next/image";

export interface ResponsiveImageProps extends Omit<ImageProps, "alt"> {
  alt: string; // Enforce non-empty alt for accessibility
  aspectRatio?: "16/9" | "4/3" | "3/2" | "1/1" | "2/3";
  containerClassName?: string;
}

const aspectRatioClasses = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "2/3": "aspect-[2/3]",
};

/**
 * Shared responsive photography component ensuring reserved aspect ratios,
 * native lazy loading, and accessible alt text handling.
 */
export function ResponsiveImage({
  alt,
  aspectRatio,
  containerClassName = "",
  className = "",
  ...props
}: ResponsiveImageProps) {
  if (aspectRatio) {
    return (
      <div
        className={`relative overflow-hidden bg-[#D7B98E]/20 ${aspectRatioClasses[aspectRatio]} ${containerClassName}`.trim()}
      >
        <Image
          alt={alt}
          fill
          quality={props.quality ?? 95}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${className}`.trim()}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      quality={props.quality ?? 95}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
}
