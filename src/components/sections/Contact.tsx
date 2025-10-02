import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, integrate with Formspree or EmailJS
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/6281234567890?text=Hello%20PT%20Mada%20Jagad%20Mulia", "_blank");
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Contact Us
          </h2>
          <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full mb-4"></div>
          <p className="text-2xl font-semibold text-primary mb-2">
            Build the Future With Us
          </p>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Get in touch to discuss your next sustainable development project
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <GlassCard className="animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">Address</h3>
                  <p className="text-foreground/80">
                    Tulungrejo, Bojonegoro<br />
                    East Java, Indonesia
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">Email</h3>
                  <a href="mailto:info@madajagadmulia.co.id" className="text-foreground/80 hover:text-primary transition-colors">
                    info@madajagadmulia.co.id
                  </a>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">Operating Hours</h3>
                  <p className="text-foreground/80">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 1:00 PM
                  </p>
                </div>
              </div>
            </GlassCard>

            <Button 
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-glow transition-all duration-300 hover:scale-105 group"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Contact Form */}
          <GlassCard className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-glass-light border-glass-border backdrop-blur-md focus:ring-primary"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-glass-light border-glass-border backdrop-blur-md focus:ring-primary"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-glass-light border-glass-border backdrop-blur-md focus:ring-primary resize-none"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105 group"
                size="lg"
              >
                Send Message
                <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Google Maps */}
        <GlassCard className="mt-8 p-0 overflow-hidden animate-fade-in" style={{ animationDelay: "400ms" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126578.88888888888!2d111.8823!3d-7.1502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77f52f32e14d57%3A0x58f6eacde23d350!2sBojonegoro%2C%20East%20Java%2C%20Indonesia!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-90"
          ></iframe>
        </GlassCard>
      </div>
    </section>
  );
};
