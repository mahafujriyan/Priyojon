import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/Priyojon.png";

type Props = {
  size?: number;
  href?: string | null;
  showName?: boolean;
  className?: string;
};

export function SiteLogo({
  size = 44,
  href = "/",
  showName = true,
  className = "",
}: Props) {
  const image = (
    <Image
      src={LOGO_SRC}
      alt="প্রিয়জন"
      width={size}
      height={size}
      className="rounded-xl object-contain shrink-0"
      priority
    />
  );

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {image}
      {showName && (
        <span className="font-bold text-zinc-900 leading-tight">
          প্রিয়জন
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export const siteLogoPath = LOGO_SRC;
