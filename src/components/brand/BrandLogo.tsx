import Image from "next/image";
import { cn } from "cn";

const VARIANTS = {
  horizontal: {
    src: "/brand/conecta-pcd-horizontal.png",
    width: 808,
    height: 304,
    className: "h-10 w-auto max-w-[11.5rem]",
  },
  slogan: {
    src: "/brand/conecta-pcd-com-slogan.png",
    width: 1376,
    height: 607,
    className: "h-[4.5rem] w-auto max-w-[18rem] sm:h-20 sm:max-w-[22rem]",
  },
  selo: {
    src: "/brand/conecta-pcd-selo.png",
    width: 1017,
    height: 1014,
    className: "size-12",
  },
} as const;

type BrandLogoProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  variant = "horizontal",
  className,
  decorative = false,
  priority = false,
}: BrandLogoProps) {
  const asset = VARIANTS[variant];

  return (
    <Image
      src={asset.src}
      alt={decorative ? "" : "Conecta PCD"}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn("object-contain object-left", asset.className, className)}
    />
  );
}
