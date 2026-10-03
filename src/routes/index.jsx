import { createFileRoute, useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  MapPin,
  Menu,
  PhoneCall,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import heroImage from "@/assets/barangay-community-hero.jpg";
import logo from "@/assets/barangay-logo.png";
import { useApp } from "@/lib/barangay-store";
import { Reveal } from "@/components/Reveal";
import { useAdmin, ADMIN_EMAIL } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-Barangay 902 | Public Information & Resident Services" },
      {
        name: "description",
        content:
          "Official public information and resident services portal for Barangay 902, Zone 100, District 6, Maynila.",
      },
      { property: "og:title", content: "E-Barangay 902 | Public Information & Resident Services" },
      {
        property: "og:description",
        content: "Stay informed and connected with Barangay 902, Zone 100, District 6, Maynila.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
const navItems = [
  { href: "#home", label: "Home" },
  { href: "#contacts", label: "Emergency Contacts" },
  { href: "#evacuation", label: "Evacuation Map" },
  { href: "#officials", label: "Barangay Officials" },
  { href: "#about", label: "About Barangay" },
];
const emergencyContacts = [
  {
    name: "Barangay 902 Hotline",
    role: "Barangay emergency desk (24/7)",
    number: "0917 555 0902",
    tel: "+639175550902",
  },
  {
    name: "Barangay Tanod Patrol",
    role: "Peace and order response",
    number: "0918 221 7788",
    tel: "+639182217788",
  },
  { name: "Manila Police District", role: "Police assistance", number: "117", tel: "117" },
  {
    name: "Bureau of Fire Protection",
    role: "Fire and rescue",
    number: "(02) 8426 0219",
    tel: "+63284260219",
  },
  {
    name: "Manila Health Emergency",
    role: "Ambulance and medical",
    number: "(02) 8711 6922",
    tel: "+63287116922",
  },
  {
    name: "MDRRMO Maynila",
    role: "Disaster risk reduction office",
    number: "0919 777 0902",
    tel: "+639197770902",
  },
];
const evacuationCenters = [
  {
    name: "Barangay 902 Covered Court",
    address: "2529 J. Posadas Street, Punta, Sta. Ana, Manila",
    capacity: "Up to 180 persons",
    note: "Primary evacuation site with first aid station.",
    destination: "2529 J. Posadas Street, Punta, Santa Ana, Manila, Philippines",
  },
  {
    name: "Zone 100 Elementary School",
    address: "Zone 100, Punta, Sta. Ana, Manila",
    capacity: "Up to 400 persons",
    note: "Classrooms opened for families during typhoons and flooding.",
    destination: "Zone 100 Elementary School, Punta, Santa Ana, Manila",
  },
  {
    name: "District 6 Community Multi-Purpose Hall",
    address: "Punta, Sta. Ana, District 6, Manila",
    capacity: "Up to 250 persons",
    note: "Backup site when the covered court is full.",
    destination: "District 6 Community Multi-Purpose Hall, Punta, Santa Ana, Manila",
  },
];
const officials = [
  {
    name: "Raven Rotao",
    position: "Punong Barangay",
    responsibility: "Leading and overseeing barangay programs and services.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Kagawad",
    responsibility: "Assists in community programs and barangay services.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Secretary",
    responsibility: "Handles barangay records, documents, and administrative matters.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Treasurer",
    responsibility: "Manages barangay financial records and collections.",
  },
];
const additionalOfficials = [
  {
    name: "Raven Rotao",
    position: "Barangay Kagawad",
    responsibility: "Committee on Peace and Order.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Kagawad",
    responsibility: "Committee on Health and Sanitation.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Kagawad",
    responsibility: "Committee on Education and Culture.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Kagawad",
    responsibility: "Committee on Environment and Cleanliness.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Kagawad",
    responsibility: "Committee on Infrastructure and Public Works.",
  },
  {
    name: "Raven Rotao",
    position: "SK Chairperson",
    responsibility: "Leads youth programs and represents the Sangguniang Kabataan.",
  },
  {
    name: "Raven Rotao",
    position: "Barangay Tanod Chief",
    responsibility: "Coordinates community safety and barangay patrol operations.",
  },
];
const publicCards = [
  {
    id: "contacts-card",
    icon: PhoneCall,
    eyebrow: "Help when needed",
    title: "Emergency Contacts",
    description: "Find essential hotlines and immediate assistance for urgent concerns.",
    detail: "View contacts",
    href: "#contacts",
  },
  {
    id: "officials-card",
    icon: Users,
    eyebrow: "Local leadership",
    title: "Barangay Officials",
    description: "Know the elected officials and community leaders serving Barangay 902.",
    detail: "View officials",
    href: "#officials",
  },
];
function HomePage() {
  const navigate = useNavigate();
  const { login, requestPasswordReset } = useApp();
  const { loginAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllOfficials, setShowAllOfficials] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const searchStr = useRouterState({ select: (state) => state.location.searchStr });
  // Subtle fade/parallax on the hero as the user scrolls.
  const [heroScroll, setHeroScroll] = useState(0);
  useEffect(() => {
    const onScroll = () => setHeroScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Show a confirmation when a resident has just submitted a registration.
  useEffect(() => {
    if (new URLSearchParams(searchStr).get("registered") === "1") {
      setMessage(
        "Registration submitted. Your account is pending verification by the barangay office. You can sign in once it is approved.",
      );
    }
  }, [searchStr]);
  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email address and password.");
      return;
    }
    // One shared form: the entered account decides which portal opens.
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      if (!loginAdmin(email, password)) {
        setError("Incorrect email address or password. Please try again.");
        return;
      }
      setMessage("Signed in. Opening the admin portal…");
      navigate({ to: "/admin" });
      return;
    }
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Incorrect email address or password. Please try again.");
      return;
    }
    setMessage("Signed in. Opening the resident portal…");
    navigate({ to: "/dashboard" });
  }
  function handleForgotSubmit(event) {
    event.preventDefault();
    setForgotError("");
    setForgotMessage("");
    const result = requestPasswordReset(forgotEmail);
    if (!result.ok) {
      setForgotError(result.error ?? "No account matches that email address.");
      return;
    }
    setForgotMessage(
      `Prototype only — no email is sent. Your temporary reset reference is ${result.code}. Please visit the Barangay 902 office to complete the reset.`,
    );
  }
  function showUiNotice(action) {
    setMessage(`${action} is available in the full resident portal.`);
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-nav-border bg-primary text-primary-foreground shadow-header">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#home"
            className="flex min-w-0 items-center gap-3"
            aria-label="E-Barangay 902 home"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gold-muted bg-white">
              <img src={logo} alt="Barangay 902 logo" className="h-9 w-9 object-contain" />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-base font-bold">E-Barangay 902</strong>
              <span className="block truncate text-xs text-nav-muted">
                Zone 100 · District 6 · Maynila
              </span>
            </span>
          </a>

          <nav className="hidden items-stretch self-stretch lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center border-b-2 border-transparent px-3 text-sm font-medium text-nav-muted transition hover:border-gold hover:text-primary-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {menuOpen ? (
          <nav
            className="border-t border-nav-border px-5 py-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-medium text-nav-muted transition hover:bg-nav-hover hover:text-primary-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <section
          id="home"
          className="relative isolate overflow-hidden bg-primary text-primary-foreground"
        >
          <div
            className="absolute inset-0 -z-20 will-change-transform"
            style={{
              transform: `translateY(${heroScroll * 0.25}px) scale(${1 + heroScroll * 0.0004})`,
              opacity: 1 - Math.min(heroScroll / 800, 0.45),
            }}
          >
            <img
              src={heroImage}
              alt="Residential street and community in Barangay 902"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-hero-overlay" />
          <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)] lg:gap-20 lg:py-20">
            <div
              className="max-w-2xl animate-reveal will-change-transform"
              style={{
                opacity: Math.max(0, 1 - heroScroll / 520),
                transform: `translateY(${heroScroll * 0.12}px)`,
              }}
            >
              <p className="inline-flex items-center gap-2 border-l-2 border-gold pl-3 text-xs font-bold uppercase text-gold sm:text-sm">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Public information portal
              </p>
              <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Barangay 902
              </h1>
              <p className="mt-4 flex items-center gap-2 text-lg font-semibold text-primary-foreground sm:text-xl">
                <MapPin className="h-5 w-5 text-gold" aria-hidden="true" /> Zone 100 · District 6 ·
                Maynila
              </p>
              <p className="mt-7 max-w-xl text-base leading-8 text-hero-muted sm:text-lg">
                Stay informed, find emergency guidance, and access resident services through one
                trusted community portal.
              </p>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-hero-muted">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold" /> Verified information
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold" /> Resident-focused service
                </span>
              </div>
            </div>

            <div className="w-full animate-card-in rounded-lg border border-card-border bg-card p-6 text-card-foreground shadow-login sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase text-gold-strong">E-Barangay portal</p>
                  <h2 className="mt-2 text-2xl font-bold">Welcome Back</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Sign in with your E-Barangay 902 account.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Email Address</span>
                  <span className="relative block">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setMessage("");
                        setError("");
                      }}
                      placeholder="you@email.com"
                      autoComplete="email"
                      className="h-12 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring-soft"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Password</span>
                  <span className="relative block">
                    <KeyRound
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setMessage("");
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-md border border-input bg-background pl-10 pr-12 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring-soft"
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-primary"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </span>
                </label>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setForgotOpen((open) => !open);
                      setForgotMessage("");
                      setForgotError("");
                      setForgotEmail(email);
                    }}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button type="submit" className="w-full">
                  Sign In <ArrowRight className="h-4 w-4" />
                </Button>

                {error ? (
                  <p
                    className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-xs leading-5 text-destructive"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                {message ? (
                  <p
                    className="rounded-md bg-muted px-3 py-2 text-center text-xs leading-5 text-muted-foreground"
                    role="status"
                  >
                    {message}
                  </p>
                ) : null}
              </form>

              {forgotOpen ? (
                <form
                  className="mt-5 rounded-md border border-border bg-muted/50 p-4"
                  onSubmit={handleForgotSubmit}
                  noValidate
                >
                  <p className="text-sm font-semibold">Reset your password</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Enter your registered email address. This prototype does not send real emails.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(event) => {
                        setForgotEmail(event.target.value);
                        setForgotError("");
                        setForgotMessage("");
                      }}
                      placeholder="you@email.com"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring-soft"
                    />
                    <Button type="submit" variant="secondary" className="sm:w-auto">
                      Send reset
                    </Button>
                  </div>
                  {forgotError ? (
                    <p className="mt-3 text-xs leading-5 text-destructive" role="alert">
                      {forgotError}
                    </p>
                  ) : null}
                  {forgotMessage ? (
                    <p className="mt-3 text-xs leading-5 text-muted-foreground" role="status">
                      {forgotMessage}
                    </p>
                  ) : null}
                </form>
              ) : null}

              <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
                New resident?{" "}
                <Link
                  to="/register"
                  className="text-sm font-semibold text-secondary transition hover:opacity-80"
                >
                  Register Account
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase text-gold-strong">Public access</p>
                <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
                  Community information, open to everyone
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
                Browse essential barangay information at any time. Resident sign-in is only needed
                for personal services and requests.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {publicCards.map((item, index) => (
                <Reveal key={item.id} delay={index * 120}>
                  <article
                    id={item.id}
                    className="group flex h-full scroll-mt-24 flex-col rounded-lg border border-border bg-card p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold-muted hover:shadow-card-hover sm:p-6 lg:p-7"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold text-primary sm:h-12 sm:w-12">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-6 text-xs font-bold uppercase text-gold-strong">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-2 break-words text-xl font-bold leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground lg:min-h-18">
                      {item.description}
                    </p>
                    <a
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-2 self-start rounded-md text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary-emphasis hover:underline lg:mt-auto lg:pt-6"
                    >
                      {item.detail}{" "}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contacts"
          className="scroll-mt-24 border-t border-border bg-muted py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="text-sm font-bold uppercase text-gold-strong">Help when needed</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Emergency Contacts
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Tap any hotline to call directly from your phone. Keep these numbers saved for
                emergencies.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {emergencyContacts.map((contact, index) => (
                <Reveal key={contact.name} delay={index * 80}>
                  <a
                    href={`tel:${contact.tel}`}
                    className="flex h-full items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-gold-muted hover:shadow-card-hover"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold text-primary">
                      <PhoneCall className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-bold">{contact.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {contact.role}
                      </span>
                      <span className="mt-2 block break-words text-lg font-bold text-primary">
                        {contact.number}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="evacuation" className="scroll-mt-24 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="text-sm font-bold uppercase text-gold-strong">Disaster preparedness</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Evacuation Centers &amp; Map
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Know where to go during floods, fire, earthquakes, or typhoons. Open the directions
                link to be guided from your current location.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
              <Reveal className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
                <iframe
                  title="Map of Barangay 902 in Punta, Santa Ana, Manila"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=121.0053%2C14.5820%2C121.0153%2C14.5920&layer=mapnik&marker=14.5870%2C121.0103"
                  className="h-72 w-full border-0 sm:h-96 lg:h-full lg:min-h-[28rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>

              <div className="grid gap-4">
                {evacuationCenters.map((center, index) => (
                  <Reveal key={center.name} delay={index * 100}>
                    <article className="h-full rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gold text-primary">
                          <MapPin className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold">{center.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{center.address}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{center.note}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-primary">
                          {center.capacity}
                        </span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(center.destination)}&travelmode=walking`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-primary-emphasis"
                        >
                          Get directions <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="officials" className="scroll-mt-24 border-t border-border py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="text-sm font-bold uppercase text-gold-strong">Local leadership</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Meet Your Barangay Officials
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Get to know the officials serving Barangay 902, Zone 100, District 6, Maynila.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(showAllOfficials ? [...officials, ...additionalOfficials] : officials).map(
                (official, index) => (
                  <Reveal key={`${official.position}-${index}`} delay={index * 80}>
                    <article className="flex h-full flex-col items-center rounded-lg border border-border bg-card p-6 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold-muted hover:shadow-card-hover">
                      <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-gold-muted bg-muted">
                        <UserRound className="h-10 w-10 text-gold-strong" aria-hidden="true" />
                      </span>
                      <span className="mt-5 text-[11px] font-bold uppercase tracking-wide text-gold-strong">
                        Official Photo
                      </span>
                      <h3 className="mt-2 break-words text-lg font-bold leading-snug">
                        {official.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-primary">{official.position}</p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {official.responsibility}
                      </p>
                    </article>
                  </Reveal>
                ),
              )}
            </div>

            <Reveal className="mt-8 text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowAllOfficials((prev) => !prev)}
              >
                {showAllOfficials ? "Show Fewer Officials" : "View All Barangay Officials"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-border bg-muted py-10">
          <Reveal className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                <img src={logo} alt="Barangay 902 logo" className="h-10 w-10 object-contain" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Serving Barangay 902</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A clearer, more accessible connection between residents and their barangay.
                </p>
              </div>
            </div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-emphasis"
            >
              Resident sign in <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="bg-primary py-8 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-semibold">Barangay 902, Zone 100, District 6, Maynila</p>
          <p className="text-nav-muted">E-Barangay 902 · Public Information Portal</p>
        </div>
      </footer>
    </div>
  );
}
