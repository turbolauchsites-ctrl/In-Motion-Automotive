import { useState, useEffect, useRef } from "react";
import autoShopImg from "@assets/1140-auto-shop_1776983409603.jpg";
import logoImg from "@assets/logo_img9505_clean.png";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Wrench, Settings, Droplet, ThermometerSnowflake, ShieldCheck, Clock, CheckCircle2, ChevronRight, Phone, MapPin, Star, PenTool, Disc, SearchCheck, ThumbsUp, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const BUSINESS = {
  name: "In Motion Automotive",
  phone: "(803) 548-2297",
  address: "Fort Mill, SC",
  hours: "Mon–Fri: 8:30am – 6:30pm | Sat: 9am – 3pm",
};

const SERVICES = [
  {
    id: "oil-changes",
    title: "Oil Changes & Preventive",
    desc: "Keep your engine running clean and strong with premium oil and comprehensive multi-point inspections.",
    icon: Droplet
  },
  {
    id: "brakes",
    title: "Brake Repair & Rotors",
    desc: "Don't compromise on safety. We provide full brake pad and rotor replacements with precision.",
    icon: ShieldCheck
  },
  {
    id: "engine",
    title: "Engine Diagnostics",
    desc: "Check engine light on? We'll find the root cause quickly and give you an honest assessment.",
    icon: SearchCheck
  },
  {
    id: "transmission",
    title: "Transmission Service",
    desc: "Expert transmission fluid exchanges and mechanical repairs to keep you shifting smoothly.",
    icon: Settings
  },
  {
    id: "tires",
    title: "Tire Services",
    desc: "Tire rotation, precise balancing, and replacement to ensure maximum grip and a smooth ride.",
    icon: Disc
  },
  {
    id: "ac-heating",
    title: "A/C & Heating",
    desc: "Stay comfortable year-round with our comprehensive climate control diagnostics and repair.",
    icon: ThermometerSnowflake
  },
  {
    id: "suspension",
    title: "Suspension & Steering",
    desc: "Fix alignment issues, shocks, and struts to restore your vehicle's handling and ride quality.",
    icon: PenTool
  },
  {
    id: "inspection",
    title: "Pre-Purchase Inspections",
    desc: "Buying a used car? Bring it to us first. We'll tell you exactly what you're getting into.",
    icon: CheckCircle2
  }
];

const REVIEWS = [
  {
    name: "T Boozer",
    text: "Felix is amazing. He's a complete professional and he is honest. All his work is superb.",
    stars: 5
  },
  {
    name: "Quinton Adams",
    text: "Came in no appointment, and Felix saw me right then and there. Fantastic. Felix looked it over and told me what the deal was — no crap, no fluff. And the price was great too! 10/10",
    stars: 5
  },
  {
    name: "Nicole Whyte",
    text: "Felix is a life saver!! I love how detailed he is in his work. He's a honest mechanic that keep saving me time after time. Thank you for all you do Felix but especially for your integrity!!",
    stars: 5
  }
];

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional()
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border py-4 shadow-sm shadow-black/20" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => goTo("/")} data-testid="nav-logo">
          <img src={logoImg} alt={BUSINESS.name} className="h-24 w-auto object-contain drop-shadow-md -translate-y-1" />
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => goTo("/")} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider hidden sm:block" data-testid="nav-home">Home</button>
          <button onClick={() => goTo("/services")} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider hidden sm:block" data-testid="nav-services">Services</button>
          <button onClick={() => goTo("/about")} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider hidden sm:block" data-testid="nav-about">About Us</button>
          <Button asChild className="font-serif uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-all hover:scale-105" data-testid="nav-cta">
            <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`}>
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/80 z-10" />
        <img 
          src="/hero.png" 
          alt="In Motion Automotive Shop" 
          className="w-full h-full object-cover object-center opacity-40 grayscale-[20%]"
        />
      </motion.div>

      <div className="container relative z-20 px-4 md:px-6 pt-32 pb-20 mt-12 md:mt-0">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 shadow-[0_0_15px_rgba(220,56,44,0.15)]">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{BUSINESS.address}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif uppercase leading-[1.05] tracking-tighter mb-6 text-foreground drop-shadow-lg">
              Fast Repairs.<br />
              <span className="text-primary drop-shadow-[0_0_20px_rgba(220,56,44,0.3)]">Zero Headaches.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              We're the local shop that treats your car like it's our own. Skilled, honest, and fast. Drop off your keys without a second thought.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-serif uppercase tracking-widest h-14 px-8 text-lg group" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} data-testid="hero-cta-contact">
                Schedule Service
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="font-serif uppercase tracking-widest h-14 px-8 text-lg border-primary/30 hover:bg-primary/10 group" asChild data-testid="hero-cta-call">
                <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`}>
                  <Phone className="w-5 h-5 mr-2 text-primary group-hover:animate-pulse" />
                  Call {BUSINESS.phone}
                </a>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-6 items-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> ASE Certified</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-20 bg-background border-y border-border/50 relative z-30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <ThumbsUp className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide mb-3">Straight Talk</h4>
            <p className="text-muted-foreground">We tell you exactly what your car needs to be safe and reliable. No upselling, no confusing jargon.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide mb-3">Master Craftsmanship</h4>
            <p className="text-muted-foreground">ASE Certified mechanics who know their craft inside and out. We do the job right the first time.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide mb-3">Fast Turnaround</h4>
            <p className="text-muted-foreground">You need your car back. We stock common parts and work efficiently to get you on the road quickly.</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-card relative z-30 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Our Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter">Everything Your Car Needs to <span className="text-primary">Stay In Motion</span>.</h3>
          </div>
          <Button variant="outline" className="hidden md:flex font-serif uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} data-testid="services-cta">
            Book an Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={service.id} 
                className="group relative p-6 md:p-8 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                <div className="mb-6 inline-flex p-3 rounded-lg bg-card border border-border group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h4 className="text-lg font-serif uppercase tracking-wide mb-3">{service.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl"></div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button size="lg" className="w-full font-serif uppercase tracking-widest h-14" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Book an Appointment
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block">
         <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background z-10" />
         <img src="/mechanic.png" alt="Mechanic hands working on engine" className="w-full h-full object-cover opacity-40 grayscale" />
      </div>
      
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="max-w-2xl lg:pr-12">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
            <span className="w-8 h-[2px] bg-primary block"></span>
            The Shop
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter mb-8 leading-tight">No Upsells. No Runaround. Just <span className="text-primary">Real Mechanics</span>.</h3>
          
          <div className="space-y-6 text-lg text-muted-foreground mb-12">
            <p>We don't upsell you on things you don't need. We don't use confusing jargon to justify a massive bill. We look at your car, tell you straight what's wrong, and fix it right the first time.</p>
            <p>Proudly Latino-owned and rooted in the Fort Mill community — we bring the same hard work and dedication to every vehicle that walks through our doors.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12 p-6 bg-card rounded-xl border border-border/50">
            <div>
              <div className="text-4xl font-serif font-bold text-primary mb-2">ASE</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Certified</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-primary mb-2">100%</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Honest Pricing</div>
            </div>
          </div>

          <Button size="lg" className="font-serif uppercase tracking-widest h-14 px-8 shadow-[0_0_20px_rgba(220,56,44,0.2)] hover:shadow-[0_0_30px_rgba(220,56,44,0.4)] transition-all" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} data-testid="about-cta">
            Experience the difference
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-card border-y border-border relative z-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-primary block"></span>
            How It Works
            <span className="w-8 h-[2px] bg-primary block"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter">The In Motion <span className="text-primary">Standard</span>.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-border border-dashed z-0" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center text-2xl font-serif font-bold text-primary mb-6 shadow-[0_0_15px_rgba(220,56,44,0.2)]">
              1
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide mb-3">Drop It Off</h4>
            <p className="text-muted-foreground">Call ahead or swing by. Tell us what's going on, hand over the keys, and let us take it from there.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center text-2xl font-serif font-bold text-primary mb-6 shadow-[0_0_15px_rgba(220,56,44,0.2)]">
              2
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide mb-3">Straight Assessment</h4>
            <p className="text-muted-foreground">We inspect the issue and give you a clear, honest explanation of what needs fixing and how much it costs. No surprises.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center text-2xl font-serif font-bold text-primary mb-6 shadow-[0_0_15px_rgba(220,56,44,0.2)]">
              3
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide mb-3">Get Back In Motion</h4>
            <p className="text-muted-foreground">We do the work right, text you when it's ready, and get you back on the road safely.</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="font-serif uppercase tracking-widest h-14 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
            <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`}>
              <Phone className="w-5 h-5 mr-2" />
              Call To Start: {BUSINESS.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-background relative z-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Word on the Street
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter">Don't just take <span className="text-primary">our word for it</span>.</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-primary text-primary" />)}
            </div>
            <span className="font-bold text-xl ml-2">5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 bg-card border border-border rounded-xl relative"
            >
              <div className="flex mb-4">
                {[...Array(review.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary mr-1" />)}
              </div>
              <p className="text-muted-foreground italic mb-6">"{review.text}"</p>
              <div className="font-serif uppercase tracking-wider font-bold">— {review.name}</div>
              
              <div className="absolute top-6 right-6 text-border opacity-20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageBreakSection() {
  return (
    <section className="h-[40vh] md:h-[60vh] relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-background/50 z-10" />
      <img 
        src={autoShopImg} 
        alt="In Motion Automotive Shop" 
        className="w-full h-full object-cover object-center grayscale-[30%] absolute inset-0 z-0"
        style={{ backgroundAttachment: 'fixed' }}
      />
      <div className="relative z-20 text-center px-4">
        <div className="w-20 h-20 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
          <AlertTriangle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl md:text-5xl font-serif uppercase tracking-tighter text-foreground drop-shadow-lg">
          Don't ignore the signs.
        </h3>
        <p className="text-xl mt-4 text-foreground/90 font-medium drop-shadow-md">
          Strange noise? Check engine light? Get it checked today.
        </p>
      </div>
    </section>
  );
}


function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/inmotionclt@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "New Appointment Request - In Motion Automotive",
          _captcha: "false",
          ...data,
        }),
      });
      const result = await response.json();
      if (result.success === "true" || result.success === true) {
        toast({
          title: "Request Sent!",
          description: "We'll be in touch shortly to confirm your appointment.",
        });
        form.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please call us directly or try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background relative z-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Get in Touch
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter mb-8">Ready to get back <span className="text-primary">on the road?</span></h3>
            <p className="text-lg text-muted-foreground mb-12 max-w-md">
              Drop your details below or give us a call directly. We'll get you scheduled and sorted out fast.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-card rounded-lg border border-border group hover:border-primary transition-colors cursor-pointer">
                  <Phone className="w-6 h-6 text-primary group-hover:animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Call Us Directly</div>
                  <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`} className="text-2xl font-serif font-bold hover:text-primary transition-colors" data-testid="contact-phone-link">
                    {BUSINESS.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-card rounded-lg border border-border">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Location</div>
                  <div className="text-xl font-serif font-bold">
                    {BUSINESS.address}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Serving Fort Mill and surrounding areas</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-card rounded-lg border border-border">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Hours</div>
                  <div className="text-xl font-serif font-bold">
                    {BUSINESS.hours}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 uppercase font-bold tracking-widest text-destructive">Closed Sunday</div>
                </div>
              </div>
            </div>
          </div>

          <div id="contact-form" className="bg-card border border-border p-8 md:p-10 rounded-2xl relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full rounded-tr-2xl -z-10 pointer-events-none" />
            <h4 className="text-2xl font-serif uppercase tracking-wide mb-6">Request Service</h4>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-background border-border h-12 focus-visible:ring-primary" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(803) 548-2297" {...field} className="bg-background border-border h-12 focus-visible:ring-primary" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} className="bg-background border-border h-12 focus-visible:ring-primary" data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Service Needed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border h-12 focus:ring-primary" data-testid="select-service">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {SERVICES.map(s => (
                            <SelectItem key={s.id} value={s.id} className="focus:bg-background focus:text-primary">{s.title}</SelectItem>
                          ))}
                          <SelectItem value="other" className="focus:bg-background focus:text-primary">Other / Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Vehicle Details & Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Year, Make, Model and what's going on..." 
                          className="resize-none bg-background border-border min-h-[120px] focus-visible:ring-primary" 
                          {...field} 
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-serif uppercase tracking-widest h-14 text-lg mt-4 shadow-[0_0_15px_rgba(220,56,44,0.2)] hover:shadow-[0_0_25px_rgba(220,56,44,0.4)] transition-all" data-testid="submit-contact">
                  {isSubmitting ? "Sending..." : "Schedule Service"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-card py-12 border-t border-border">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <img src={logoImg} alt={BUSINESS.name} className="h-24 w-auto object-contain drop-shadow-md" />
          </div>
          
          <div className="flex gap-6">
            <a href="/services" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider text-muted-foreground">Services</a>
            <a href="/about" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider text-muted-foreground">About Us</a>
            <a href="/#contact-form" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); } }} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider text-muted-foreground">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest font-medium">
          <div>&copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</div>
          <div>Built for mechanics who care.</div>
        </div>
      </div>
    </footer>
  );
}

const OIL_CHANGE_SERVICES = [
  { name: "18-Point Synthetic Blend", price: "$59.99", note: "" },
  { name: "18-Point Full Synthetic", price: "From $79.99", note: "" },
  { name: "18-Point Euro 7L", price: "$125.00", note: "" },
];

const PRICED_SERVICES = [
  { name: "Tire Rotation", price: "From $29.00", icon: Disc },
  { name: "Transmission Service", price: "$189.99", icon: Settings },
  { name: "Brake Flush", price: "$123.00", icon: ShieldCheck },
  { name: "Power Steering Flush", price: "$139.00", icon: Wrench },
  { name: "Cabin & Air Filters", price: "From $39.00", icon: ThermometerSnowflake },
];

const GENERAL_SERVICES = [
  { name: "Diagnostic & Electrical", icon: SearchCheck },
  { name: "Engine & Transmission Repair", icon: Settings },
  { name: "Brakes, Axles & Tires", icon: ShieldCheck },
  { name: "Steering & Suspension", icon: PenTool },
  { name: "Tune-Ups", icon: Wrench },
  { name: "A/C & Heat", icon: ThermometerSnowflake },
  { name: "Cooling System & Timing", icon: AlertTriangle },
  { name: "Pre-Purchase Inspections", icon: CheckCircle2 },
];

function ServicesPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container px-4 md:px-6 mx-auto">

          {/* Header */}
          <div className="mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Import · Domestic · Euro
            </h2>
            <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter mb-6">Services <span className="text-primary">&amp; Pricing</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Honest pricing. No surprises. Labor rate from <span className="text-foreground font-bold">$125/hr</span>. All 18-point oil change services include 5 qt. of oil, air &amp; fluid check.</p>
          </div>

          {/* Oil Changes */}
          <div className="mb-16">
            <h3 className="text-xl font-serif uppercase tracking-widest mb-2 flex items-center gap-3">
              <Droplet className="w-5 h-5 text-primary" />
              18-Point Oil Change Services
            </h3>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">All include: 5 Qt. Oil · Air · Fluid Check</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {OIL_CHANGE_SERVICES.map((svc) => (
                <div key={svc.name} className="flex items-center justify-between p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <span className="font-serif uppercase tracking-wide text-sm">{svc.name}</span>
                  <span className="text-primary font-bold text-lg font-serif">{svc.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priced Services */}
          <div className="mb-16">
            <h3 className="text-xl font-serif uppercase tracking-widest mb-6 flex items-center gap-3">
              <Wrench className="w-5 h-5 text-primary" />
              Additional Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRICED_SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.name} className="flex items-center justify-between p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background border border-border rounded-lg group-hover:border-primary/50 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-serif uppercase tracking-wide text-sm">{svc.name}</span>
                    </div>
                    <span className="text-primary font-bold text-lg font-serif ml-4 shrink-0">{svc.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* General Services */}
          <div className="mb-16">
            <h3 className="text-xl font-serif uppercase tracking-widest mb-2 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              General Repair &amp; Maintenance
            </h3>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">Labor from $125/hr · Quotes provided before work begins</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {GENERAL_SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.name} className="flex items-center gap-3 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group">
                    <div className="p-2 bg-background border border-border rounded-lg group-hover:border-primary/50 transition-colors shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-serif uppercase tracking-wide text-sm">{svc.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <h3 className="text-3xl md:text-4xl font-serif uppercase tracking-tighter mb-4">Ready to book?</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Call us directly or fill out our contact form and we'll get you scheduled fast.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-serif uppercase tracking-widest h-14 px-8" asChild>
                <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {BUSINESS.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="font-serif uppercase tracking-widest h-14 px-8 border-primary/30 hover:bg-primary/10" onClick={() => { navigate("/"); setTimeout(() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" }), 150); }}>
                Schedule Service
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function AboutPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container px-4 md:px-6 mx-auto">

          {/* Header */}
          <div className="mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary block"></span>
              The Shop
            </h2>
            <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter mb-6">No Upsells. No Runaround. Just <span className="text-primary">Real Mechanics</span>.</h1>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <div className="space-y-6 text-lg text-muted-foreground mb-10">
                <p>We don't upsell you on things you don't need. We don't use confusing jargon to justify a massive bill. We look at your car, tell you straight what's wrong, and fix it right the first time.</p>
                <p>Proudly Latino-owned and rooted in the Fort Mill community — we bring the same hard work and dedication to every vehicle that walks through our doors.</p>
                <p>Import, domestic, or Euro — we work on all makes and models with the same level of care and precision. Every vehicle gets our full attention.</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="text-4xl font-serif font-bold text-primary mb-2">ASE</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Certified</div>
                </div>
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="text-4xl font-serif font-bold text-primary mb-2">100%</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Honest Pricing</div>
                </div>
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="text-4xl font-serif font-bold text-primary mb-2">I·D·E</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Import · Domestic · Euro</div>
                </div>
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="text-4xl font-serif font-bold text-primary mb-2">Latino</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Owned & Operated</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-serif uppercase tracking-widest h-14 px-8" asChild>
                  <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {BUSINESS.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="font-serif uppercase tracking-widest h-14 px-8 border-primary/30 hover:bg-primary/10" onClick={() => { navigate("/"); setTimeout(() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" }), 150); }}>
                  Schedule Service
                </Button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-border h-[500px]">
              <img src="/mechanic.png" alt="In Motion Automotive Shop" className="w-full h-full object-cover opacity-60 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Hours</div>
                <div className="text-xl font-serif font-bold text-foreground">{BUSINESS.hours}</div>
                <div className="text-sm text-destructive font-bold uppercase tracking-widest mt-1">Closed Sunday</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-card border border-border rounded-2xl p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <MapPin className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Location</div>
                <div className="text-lg font-serif font-bold">{BUSINESS.address}</div>
                <div className="text-sm text-muted-foreground mt-1">Serving Fort Mill &amp; surrounding areas</div>
              </div>
              <div>
                <Clock className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Hours</div>
                <div className="text-sm font-serif font-bold">{BUSINESS.hours}</div>
                <div className="text-sm text-destructive font-bold uppercase tracking-widest mt-1">Closed Sunday</div>
              </div>
              <div>
                <Phone className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone</div>
                <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`} className="text-lg font-serif font-bold hover:text-primary transition-colors">{BUSINESS.phone}</a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <ProcessSection />
      <Footer />
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <Navigation />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ImageBreakSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
