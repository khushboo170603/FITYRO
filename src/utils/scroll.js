import Lenis from "@studio-freight/lenis";

let lenis;

export function initLenis() {
  if (!lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.05 - Math.pow(2, -10 * t)),
      smooth: true,
    });
  }
  return lenis;
}

export function smoothScrollTo(target) {
  if (!lenis) return;
  lenis.scrollTo(target);
}
