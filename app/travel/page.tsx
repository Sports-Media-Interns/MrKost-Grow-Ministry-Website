import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, Heart, Globe, Shield, BookOpen, Plane, ArrowRight, Quote, CheckCircle, Phone } from "lucide-react";
import type { TravelLocation } from "@/components/ui/travel-map";
import { TravelMapWrapper } from "@/components/ui/travel-map-wrapper";
import { TripPlanner } from "./trip-planner";
import { DestinationTabs } from "./destination-tabs";

export const metadata: Metadata = {
  title: "Faith-Based Travel | Mission Trips & Pilgrimages",
  description:
    "Plan mission trips, pilgrimages, retreats, and spiritual tours with Grow Ministry Travel. Guided faith-based journeys that deepen community and faith.",
  keywords: [
    "faith-based travel",
    "church mission trips",
    "Christian pilgrimages",
    "ministry retreats",
    "spiritual tours",
    "Holy Land tours for churches",
    "church group travel",
    "faith-based group tours",
    "mission trip planning",
    "Christian travel company",
    "church retreat planning",
    "spiritual growth travel",
  ],
  openGraph: {
    title: "Faith-Based Travel & Pilgrimages | Grow Ministry Travel",
    description:
      "Mission trips, pilgrimages, retreats, and spiritual tours designed for churches and ministries. Guided journeys that deepen faith and build community.",
    url: "https://growministry.com/travel",
  },
  twitter: {
    title: "Faith-Based Travel & Pilgrimages | Grow Ministry",
    description:
      "Mission trips, pilgrimages, retreats, and spiritual tours for churches. Transform your congregation through shared travel experiences.",
  },
};

const locations: TravelLocation[] = [
  // === PILGRIMAGES — Biblical & Historical Sites ===
  {
    id: "jerusalem",
    name: "Jerusalem, Israel",
    description: "Walk in the footsteps of Jesus through the Holy Land. Visit the Western Wall, Church of the Holy Sepulchre, Garden of Gethsemane, and the Via Dolorosa.",
    coordinates: [31.7683, 35.2137],
    type: "pilgrimage",
    country: "Israel",
  },
  {
    id: "rome",
    name: "Rome, Italy",
    description: "Visit the Vatican, the Sistine Chapel, and ancient churches. Trace the history of early Christianity in the Eternal City.",
    coordinates: [41.9028, 12.4964],
    type: "pilgrimage",
    country: "Italy",
  },
  {
    id: "greece",
    name: "Athens & Corinth, Greece",
    description: "Follow the journeys of the Apostle Paul through ancient Greece. Visit Mars Hill, Corinth, and Thessaloniki.",
    coordinates: [37.9838, 23.7275],
    type: "pilgrimage",
    country: "Greece",
  },
  {
    id: "jordan",
    name: "Amman & Petra, Jordan",
    description: "Explore biblical sites including Mount Nebo, the Baptism Site on the Jordan River, and the ancient city of Petra.",
    coordinates: [31.9454, 35.9284],
    type: "pilgrimage",
    country: "Jordan",
  },
  {
    id: "egypt",
    name: "Cairo & Sinai, Egypt",
    description: "Visit the Coptic churches of Old Cairo, Mount Sinai, St. Catherine&apos;s Monastery, and trace the route of the Exodus.",
    coordinates: [30.0444, 31.2357],
    type: "pilgrimage",
    country: "Egypt",
  },
  {
    id: "turkey",
    name: "Ephesus & Cappadocia, Turkey",
    description: "Explore the Seven Churches of Revelation, the ancient city of Ephesus, and the underground churches of Cappadocia.",
    coordinates: [38.6227, 34.7242],
    type: "pilgrimage",
    country: "Turkey",
  },
  {
    id: "spain",
    name: "Santiago de Compostela, Spain",
    description: "Walk the historic Camino de Santiago pilgrimage route. University outreach and church revitalization in post-Christian Europe.",
    coordinates: [42.8782, -8.5448],
    type: "pilgrimage",
    country: "Spain",
  },

  // === MISSIONS — Latin America & Caribbean ===
  {
    id: "haiti",
    name: "Port-au-Prince, Haiti",
    description: "Community rebuilding, educational support, clean water initiatives, and church construction in one of the Caribbean&apos;s most resilient nations.",
    coordinates: [18.5944, -72.3074],
    type: "mission",
    country: "Haiti",
  },
  {
    id: "honduras",
    name: "Tegucigalpa, Honduras",
    description: "Construction projects, children&apos;s programs, medical clinics, and long-standing church partnerships in Central America.",
    coordinates: [14.0723, -87.1921],
    type: "mission",
    country: "Honduras",
  },
  {
    id: "guatemala",
    name: "Antigua, Guatemala",
    description: "Build homes, provide medical outreach, and partner with local churches in rural communities across the Guatemalan highlands.",
    coordinates: [14.5586, -90.7295],
    type: "mission",
    country: "Guatemala",
  },
  {
    id: "belize",
    name: "Belize City, Belize",
    description: "Youth team ministry, church support, rural poverty relief, and community development projects in coastal and jungle communities.",
    coordinates: [17.4986, -88.1886],
    type: "mission",
    country: "Belize",
  },
  {
    id: "costa-rica",
    name: "San Jos\u00e9, Costa Rica",
    description: "Youth camps, church support, community projects, and evangelism in one of Central America&apos;s most welcoming nations.",
    coordinates: [9.9281, -84.0907],
    type: "mission",
    country: "Costa Rica",
  },
  {
    id: "dominican",
    name: "Santo Domingo, Dominican Republic",
    description: "Vacation Bible School programs, community construction, camp ministry, and youth outreach across the island.",
    coordinates: [18.4861, -69.9312],
    type: "mission",
    country: "Dominican Republic",
  },
  {
    id: "peru",
    name: "Lima, Peru",
    description: "Medical missions providing healthcare and dental services in underserved Andean communities. Agriculture and clean water projects.",
    coordinates: [-12.0464, -77.0428],
    type: "mission",
    country: "Peru",
  },

  // === MISSIONS — Sub-Saharan Africa ===
  {
    id: "kenya",
    name: "Nairobi, Kenya",
    description: "Partner with local churches to support orphanages, schools, clean water projects, and community health programs in East Africa.",
    coordinates: [-1.2921, 36.8219],
    type: "mission",
    country: "Kenya",
  },
  {
    id: "uganda",
    name: "Kampala, Uganda",
    description: "Education, clean water, medical outreach, and church planting support. Work alongside Ugandan pastors and community leaders.",
    coordinates: [0.3476, 32.5825],
    type: "mission",
    country: "Uganda",
  },
  {
    id: "tanzania",
    name: "Arusha, Tanzania",
    description: "Community health education, school construction, evangelism, and partnerships with Maasai church communities near Mount Kilimanjaro.",
    coordinates: [-3.3869, 36.6830],
    type: "mission",
    country: "Tanzania",
  },

  // === MISSIONS — South & Southeast Asia ===
  {
    id: "india",
    name: "New Delhi, India",
    description: "Urban poverty relief, church support and leadership training, and community development in partnership with Indian ministry networks.",
    coordinates: [28.6139, 77.2090],
    type: "mission",
    country: "India",
  },
  {
    id: "thailand",
    name: "Chiang Mai, Thailand",
    description: "Human trafficking recovery support, church planting, English teaching, and community development in northern Thailand.",
    coordinates: [18.7883, 98.9853],
    type: "mission",
    country: "Thailand",
  },
  {
    id: "cambodia",
    name: "Phnom Penh, Cambodia",
    description: "Church planting, English teaching, anti-trafficking ministry, and community development with vulnerable populations.",
    coordinates: [11.5564, 104.9282],
    type: "mission",
    country: "Cambodia",
  },

  // === MISSIONS — Domestic U.S. ===
  {
    id: "appalachia",
    name: "Pikeville, Kentucky (Appalachia)",
    description: "Housing repair, disaster response, community outreach, and poverty relief in rural Appalachian communities.",
    coordinates: [37.4793, -82.5188],
    type: "mission",
    country: "United States",
  },
  {
    id: "chicago",
    name: "Chicago, Illinois",
    description: "Inner-city poverty relief, homelessness outreach, immigrant and refugee ministry, and youth mentorship programs.",
    coordinates: [41.8781, -87.6298],
    type: "mission",
    country: "United States",
  },
  {
    id: "newyork",
    name: "New York City, New York",
    description: "Urban ministry serving homeless populations, immigrant communities, and at-risk youth across all five boroughs.",
    coordinates: [40.7128, -74.0060],
    type: "mission",
    country: "United States",
  },
  {
    id: "losangeles",
    name: "Los Angeles, California",
    description: "Homelessness outreach, refugee resettlement support, and community development in one of America&apos;s most diverse cities.",
    coordinates: [34.0522, -118.2437],
    type: "mission",
    country: "United States",
  },
  {
    id: "miami",
    name: "Miami, Florida",
    description: "Immigrant and refugee ministry, disaster response readiness, and community outreach in South Florida&apos;s diverse neighborhoods.",
    coordinates: [25.7617, -80.1918],
    type: "mission",
    country: "United States",
  },
  {
    id: "gulfcoast",
    name: "Gulf Coast, Mississippi",
    description: "Hurricane disaster response, housing repair, and long-term community rebuilding along the Gulf Coast.",
    coordinates: [30.3960, -89.0928],
    type: "mission",
    country: "United States",
  },

  // === RETREATS ===
  {
    id: "colorado",
    name: "Colorado Rockies, USA",
    description: "Mountain retreat for youth groups and church leaders. Worship sessions, team building, and nature excursions in the Rockies.",
    coordinates: [39.5501, -105.7821],
    type: "retreat",
    country: "United States",
  },
  {
    id: "portugal",
    name: "Lisbon, Portugal",
    description: "Leadership renewal retreat combining spiritual formation with cultural immersion in one of Europe&apos;s most welcoming cities.",
    coordinates: [38.7223, -9.1393],
    type: "retreat",
    country: "Portugal",
  },

  // === WORKSHOPS & CONFERENCES ===
  {
    id: "tennessee",
    name: "Nashville, Tennessee, USA",
    description: "Worship and leadership conferences featuring top Christian artists, speakers, and ministry leaders in Music City.",
    coordinates: [36.1627, -86.7816],
    type: "workshop",
    country: "United States",
  },
];

const tripTypes = [
  {
    icon: Globe,
    title: "Mission Trips",
    description: "Serve communities worldwide through construction, education, medical outreach, and evangelism projects.",
    count: locations.filter((l) => l.type === "mission").length,
    gradient: "from-primary/90 to-primary/60",
    image: "/images/services/travel.webp",
  },
  {
    icon: BookOpen,
    title: "Pilgrimages",
    description: "Walk where biblical figures walked. Deepen your faith through immersive journeys to the Holy Land and beyond.",
    count: locations.filter((l) => l.type === "pilgrimage").length,
    gradient: "from-primary/90 to-primary/60",
    image: "/images/heroes/contact-hero.webp",
  },
  {
    icon: Heart,
    title: "Spiritual Retreats",
    description: "Renew your spirit in peaceful mountain settings with guided worship, prayer, and fellowship.",
    count: locations.filter((l) => l.type === "retreat").length,
    gradient: "from-primary/90 to-primary/60",
    image: "/images/heroes/about-hero.webp",
  },
  {
    icon: Users,
    title: "Workshops & Conferences",
    description: "Learn from leading ministry voices at worship conferences and leadership development events.",
    count: locations.filter((l) => l.type === "workshop").length,
    gradient: "from-primary/90 to-primary/60",
    image: "/images/heroes/services-hero.webp",
  },
];

const features = [
  { icon: Shield, title: "Safety First", description: "Vetted partners and comprehensive travel insurance for every trip.", image: "/images/services/ai-telephone.webp" },
  { icon: Heart, title: "Faith-Centered", description: "Every itinerary includes worship, devotionals, and spiritual growth.", image: "/images/heroes/travel-hero.webp" },
  { icon: Users, title: "Group Friendly", description: "Custom packages for church groups of any size.", image: "/images/heroes/about-hero.webp" },
  { icon: Calendar, title: "Flexible Dates", description: "Year-round scheduling to fit your congregation's calendar.", image: "/images/services/social-media.webp" },
  { icon: Plane, title: "All-Inclusive", description: "Flights, accommodation, meals, and local transport arranged.", image: "/images/heroes/contact-hero.webp" },
  { icon: MapPin, title: "Expert Guides", description: "Local Christian guides with deep knowledge of each destination.", image: "/images/services/master-report.webp" },
];

const travelJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Grow Ministry Travel",
  url: "https://growministry.com/travel",
  description:
    "Faith-based travel agency specializing in mission trips, pilgrimages, retreats, and spiritual tours for churches and ministries.",
  parentOrganization: {
    "@type": "Organization",
    name: "Grow Ministry",
    url: "https://growministry.com",
  },
  areaServed: "Worldwide",
  priceRange: "$$",
};

export default function TravelPage() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelJsonLd) }}
      />
      {/* Hero */}
      <section className="relative text-primary-foreground py-24 px-4 overflow-hidden">
        <Image
          src="/images/heroes/travel-hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            Grow Ministry Travel
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Faith-Based Travel Programs
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Organize mission trips, pilgrimages, spiritual retreats, and worship tours for your congregation. Transform lives through travel.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="#trip-planner"
              className="rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/80 transition"
            >
              Plan a Trip
            </a>
            <a
              href="#destinations"
              className="rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition"
            >
              View Destinations
            </a>
          </div>
        </div>
      </section>

      {/* Trip Types */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
            Travel Programs
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-center font-[family-name:var(--font-playfair)]">
            Types of Travel Programs
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            Choose the experience that fits your congregation&apos;s calling
          </p>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {tripTypes.map((type) => (
              <div
                key={type.title}
                className="relative rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${type.gradient}`} />
                <div className="relative p-4 lg:p-6 text-center text-white min-h-[160px] lg:min-h-[220px] flex flex-col items-center justify-center">
                  <type.icon className="size-8 lg:size-10 mx-auto drop-shadow-lg" />
                  <h3 className="mt-3 lg:mt-4 text-sm lg:text-lg font-semibold drop-shadow-md">{type.title}</h3>
                  <p className="mt-1 lg:mt-2 text-xs lg:text-sm text-white/80 leading-relaxed hidden sm:block">
                    {type.description}
                  </p>
                  <p className="mt-3 lg:mt-4 text-2xl lg:text-3xl font-bold drop-shadow-md">{type.count}</p>
                  <p className="text-xs text-white/70">destinations</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Planner Wizard */}
      <section id="trip-planner" className="relative py-24 px-4 overflow-hidden">
        <Image
          src="/images/heroes/travel-hero.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto max-w-screen-xl">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/40 text-center mb-3">
            Trip Planning
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-primary-foreground font-[family-name:var(--font-playfair)]">
            Plan Your Trip
          </h2>
          <p className="mt-4 text-center text-primary-foreground/70 max-w-2xl mx-auto mb-12">
            Use our trip planner to tell us about your group and we&apos;ll help you build the perfect faith-based travel experience.
          </p>
          <div className="rounded-xl border border-border/10 bg-background p-6 md:p-10 shadow-xl">
            <TripPlanner locations={locations} />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="destinations" className="py-24 px-4 bg-muted/50">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
            Explore the World
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-center font-[family-name:var(--font-playfair)]">
            Our Destinations
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Explore faith-based travel destinations around the world. Click a marker to learn more.
          </p>

          <TravelMapWrapper locations={locations} />

          {/* Destination Cards with Regional Tabs */}
          <div className="mt-16">
            <DestinationTabs locations={locations} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left column — heading and description */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Why Grow Ministry
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
                Why Travel With Us
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We handle every detail so your group can focus on what matters most — spiritual growth, meaningful connections, and life-changing experiences. From the first call to the last day of the trip, our team is with you every step of the way.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle className="size-4 text-accent" />
                <span>Trusted by 200+ church groups nationwide</span>
              </div>
            </div>

            {/* Right column — feature cards 2x3 grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-xl overflow-hidden h-52 cursor-default hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/85 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300" />
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <feature.icon className="size-8 text-white drop-shadow-lg mb-3" />
                    <h3 className="text-base font-semibold text-white drop-shadow-md">{feature.title}</h3>
                    <p className="mt-1 text-sm text-white/80 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-center font-[family-name:var(--font-playfair)]">
            How It Works
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            Planning a faith-based trip for your group is easier than you think
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border" aria-hidden="true" />

            {[
              {
                step: "01",
                icon: Globe,
                title: "Choose Your Trip",
                description: "Browse our destinations and trip types, or tell us your vision. We offer mission trips, pilgrimages, retreats, and worship tours across 6 continents.",
              },
              {
                step: "02",
                icon: Calendar,
                title: "We Plan the Details",
                description: "Our coordinators handle flights, accommodations, meals, local guides, and itineraries tailored to your group size, budget, and spiritual goals.",
              },
              {
                step: "03",
                icon: Heart,
                title: "Travel & Transform",
                description: "Experience a journey that deepens faith, builds community, and creates lasting impact — for your group and the communities you visit.",
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex items-center justify-center size-20 rounded-full bg-background border-2 border-accent shadow-sm">
                  <item.icon className="size-8 text-primary" />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-accent">
                  Step {item.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold font-[family-name:var(--font-playfair)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden text-primary-foreground">
        <Image
          src="/images/heroes/travel-hero.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative mx-auto max-w-screen-xl">
          {/* Testimonial */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Quote className="size-8 text-accent/40 mx-auto mb-4" />
            <blockquote className="text-lg md:text-xl italic text-primary-foreground/80 leading-relaxed font-[family-name:var(--font-playfair)]">
              &ldquo;Grow Ministry made organizing our Holy Land pilgrimage completely stress-free. Every detail was handled with care, and our congregation came home transformed.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-medium text-primary-foreground/60">
              — Pastor Michael Thompson, Grace Community Church
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 mb-14">
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">{locations.length}+</p>
              <p className="mt-1 text-sm text-primary-foreground/50 uppercase tracking-wider">Destinations</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-primary-foreground/15" aria-hidden="true" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">6</p>
              <p className="mt-1 text-sm text-primary-foreground/50 uppercase tracking-wider">Continents</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-primary-foreground/15" aria-hidden="true" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">4</p>
              <p className="mt-1 text-sm text-primary-foreground/50 uppercase tracking-wider">Trip Types</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-primary-foreground/15" aria-hidden="true" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">200+</p>
              <p className="mt-1 text-sm text-primary-foreground/50 uppercase tracking-wider">Groups Served</p>
            </div>
          </div>

          {/* Heading + CTAs */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/40 mb-3">
              Get Started
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
              Ready to Plan Your Next Trip?
            </h2>
            <p className="mt-4 text-primary-foreground/70 max-w-xl mx-auto">
              Whether you know exactly where you want to go or need help deciding, our travel coordinators are ready to build the perfect experience for your group.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-8 py-3 text-sm font-medium hover:bg-accent/80 transition"
              >
                Get a Custom Quote
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 text-primary-foreground px-8 py-3 text-sm font-medium hover:bg-primary-foreground/10 transition"
              >
                <Phone className="size-4" />
                Talk to a Travel Coordinator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
