import { lazy, Suspense, useEffect, useRef, useState } from "react";

// maplibre-gl is ~800 kB; only fetch it when the map section is about to scroll into view.
const LocationMap = lazy(() => import("@/components/LocationMap"));

function Placeholder() {
  return (
    <section
      id="about"
      aria-busy="true"
      className="bg-[#050505] scroll-mt-[72px] h-[760px] lg:h-[calc(100vh-72px)]"
    />
  );
}

export default function LazyLocationMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(() => window.location.hash === "#about");

  useEffect(() => {
    if (show || !ref.current) return;
    if (!("IntersectionObserver" in window)) return setShow(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref}>
      {show ? (
        <Suspense fallback={<Placeholder />}>
          <LocationMap />
        </Suspense>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}
