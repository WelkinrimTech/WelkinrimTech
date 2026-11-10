import { useLocation } from "wouter";
import { goToHomeSection } from "@/lib/scrollTo";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Technology", href: "#depth" },
  { label: "Products", href: "/products", isRoute: true },
  { label: "About", href: "/about", isRoute: true },
  { label: "Contact", href: "#contact" },
  { label: "Updates", href: "https://welkinrim-updates-website.vercel.app/", external: true },
];

const industries = ["UAV/eVTOL", "Marine", "Land", "Robotics"];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/welkinrimtechnologies/posts/?feedView=all",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@WelkinrimTech",
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </>
    ),
  },
  {
    label: "X",
    href: "https://x.com/WelkinrimTech",
    icon: (
      <path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.61l-5.18-6.77-5.925 6.77H1.803l7.73-8.835L1.374 2.25h6.777l4.68 6.185 5.413-6.185zm-1.16 17.52h1.833L7.084 4.126H5.117l11.967 15.644z"></path>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/welkinrimtech/",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </>
    ),
  },
];

export default function Footer() {
  const [, navigate] = useLocation();
  const handleNav = (link: typeof navLinks[number]) => {
    if ("external" in link && link.external) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    } else if ("isRoute" in link && link.isRoute) {
      navigate(link.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Works from any page: returns to Home first, then scrolls to the section.
      goToHomeSection(navigate, link.href.slice(1));
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Top section */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-16 py-6 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <img loading="lazy" decoding="async"
              src={`${import.meta.env.BASE_URL}wt-logo-white.svg`}
              alt="Welkinrim Technologies"
              className="h-8 md:h-10 w-auto"
            />
          </div>
          <p className="text-[#808080] text-xs leading-relaxed mb-4" style={{ fontFamily: 'Lexend, sans-serif' }}>
            Pioneering the future of electric propulsion for UAV, Marine, Land and Robotics applications.
          </p>
          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-8 h-8 border border-white/10 hover:border-[#ffc812] hover:text-[#ffc812] flex items-center justify-center text-white/50 transition-all duration-200 group"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#ffc812] mb-3 md:mb-4" style={{ fontFamily: 'Michroma, sans-serif' }}>
            Navigation
          </div>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link)}
                className="text-left text-xs text-white/60 hover:text-[#ffc812] transition-colors duration-200 uppercase tracking-widest"
                style={{ fontFamily: 'Michroma, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Industries */}
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#ffc812] mb-3 md:mb-4" style={{ fontFamily: 'Michroma, sans-serif' }}>
            Industries
          </div>
          <div className="flex flex-col gap-2">
            {industries.map((ind) => (
              <span key={ind} className="text-xs text-white/60 uppercase tracking-widest" style={{ fontFamily: 'Michroma, sans-serif' }}>
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#ffc812] mb-3 md:mb-4" style={{ fontFamily: 'Michroma, sans-serif' }}>
            Contact
          </div>
          <div className="flex flex-col gap-3 text-xs text-white/60" style={{ fontFamily: 'Lexend, sans-serif' }}>
            <div>
              <div className="text-[#808080] text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: 'Michroma, sans-serif' }}>Registered Address</div>
              #5, Chokkanathar Street, MMDA Nagar<br />Chitalapakam, Chennai 600064
            </div>
            <div>
              <div className="text-[#808080] text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: 'Michroma, sans-serif' }}>Factory Address</div>
              #23, Sujatha nagar, kandigai village,<br />Panruti, Sripermabadur, TN - 631604
            </div>
            <div>
              <div className="text-[#808080] text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: 'Michroma, sans-serif' }}>Email</div>
              connect@welkinrim.com
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-16 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-white/30 uppercase tracking-widest" style={{ fontFamily: 'Michroma, sans-serif' }}>
            © {new Date().getFullYear()} Welkinrim Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-[#ffc812]/40" />
            <span className="text-[10px] text-[#ffc812]/60 uppercase tracking-widest px-2" style={{ fontFamily: 'Michroma, sans-serif' }}>
              Made with 💛 by Upcheck Technologies.
            </span>
            <div className="h-px w-8 bg-[#ffc812]/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
