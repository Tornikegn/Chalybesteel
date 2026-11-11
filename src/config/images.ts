/**
 * Optional photo slots. The site is complete with SVG illustrations alone.
 * To use a photo: add the file to /public/images with the filename below,
 * set `enabled: true`, and record the source and licence in CREDITS.md.
 * Never use images showing identifiable mill brands or logos.
 */
export interface PhotoSlot {
  src: string;
  alt: string;
  width: number;
  height: number;
  enabled: boolean;
}

export const photos = {
  homeHero: {
    src: "/images/casing-joints-stacked-on-pipe-rack.jpg",
    alt: "Seamless casing joints with thread protectors stacked on a pipe rack",
    width: 1600,
    height: 1067,
    enabled: false,
  },
  quality: {
    src: "/images/inspector-checking-casing-thread-gauge.jpg",
    alt: "Inspector gauging the threads of a casing joint",
    width: 1600,
    height: 1067,
    enabled: false,
  },
  logistics: {
    src: "/images/octg-bundles-loading-at-port.jpg",
    alt: "Bundled tubing being loaded at a port for break-bulk shipment",
    width: 1600,
    height: 1067,
    enabled: false,
  },
  about: {
    src: "/images/seamless-pipe-ends-cross-section.jpg",
    alt: "Ends of seamless steel pipes showing wall cross-sections",
    width: 1600,
    height: 1067,
    enabled: false,
  },
} satisfies Record<string, PhotoSlot>;
