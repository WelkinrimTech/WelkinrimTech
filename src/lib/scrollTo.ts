/**
 * Scroll to a section on the home page from anywhere on the site.
 *
 * Home is lazy-loaded, so after navigating to "/" the target element may not exist
 * yet; wait for it (up to `timeoutMs`) instead of guessing with a fixed delay.
 */
export function goToHomeSection(
  navigate: (to: string) => void,
  id: string,
  timeoutMs = 6000,
): void {
  const scroll = (el: HTMLElement) => el.scrollIntoView({ behavior: "smooth", block: "start" });

  if (window.location.pathname === "/") {
    const el = document.getElementById(id);
    if (el) {
      scroll(el);
      return;
    }
  } else {
    navigate("/");
  }

  const started = performance.now();
  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      // One more frame so layout above the target (images, lazy sections) settles.
      requestAnimationFrame(() => scroll(el));
      return;
    }
    if (performance.now() - started < timeoutMs) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
