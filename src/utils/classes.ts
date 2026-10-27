// Scroll-in animation classes. They must stay plain class strings in the markup (not a CSS @utility):
// the observer in BasicScripts.astro finds elements by their `intersect:` class tokens and reads the `intersect-*` flags.
const FADE_IN = 'motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade';

export const REVEAL_ONCE = `intersect-once ${FADE_IN}`;
export const REVEAL = `intersect-once intersect-quarter ${FADE_IN}`;
export const REVEAL_NO_QUEUE = `intersect-once intersect-quarter intersect-no-queue ${FADE_IN}`;
