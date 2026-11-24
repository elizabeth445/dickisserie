import type { ImgHTMLAttributes } from "react";
const imageSizes: Record<string, [number, number]> = {
  "waffle-trio": [1000, 1143],
  "pussy-box": [866, 695],
  "mixed-box": [708, 675],
  "single-pack": [880, 733],
  "mini-waffles": [184, 475],
};
export function ProductImage({
  image,
  alt,
  sizes = "(max-width:700px) calc(100vw - 80px), 430px",
  ...props
}: { image: string; alt: string } & ImgHTMLAttributes<HTMLImageElement>) {
  const [width, height] = imageSizes[image] || [880, 880];
  const set =
    image === "mini-waffles"
      ? undefined
      : image === "waffle-trio"
        ? `/assets/${image}-480.webp 480w, /assets/${image}.webp 1000w`
        : `/assets/${image}-420.webp 420w, /assets/${image}.webp ${width}w`;
  return (
    <picture>
      {image === "waffle-trio" ? (
        <source
          type="image/avif"
          srcSet="/assets/waffle-trio-480.avif 480w, /assets/waffle-trio.avif 1000w"
          sizes={sizes}
        />
      ) : null}
      <img
        src={`/assets/${image}.webp`}
        srcSet={set}
        sizes={set ? sizes : undefined}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    </picture>
  );
}
