import { ShoppingBag, Headphones, Smartphone, Building2 } from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    title: "Shopping",
    description: "Premium Products",
    color: "bg-gradient-copper",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "24/7 Service",
    color: "bg-gradient-luxury",
  },
  {
    icon: Smartphone,
    title: "Digital",
    description: "Smart Solutions",
    color: "bg-accent",
  },
  {
    icon: Building2,
    title: "Business",
    description: "Corporate Sales",
    color: "bg-gradient-primary",
  },
];

const ServiceCategories = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="group bg-card rounded-none p-4 md:p-6 shadow-classic hover:shadow-classic-hover transition-all duration-300 cursor-pointer border border-border/30 hover:border-primary/30"
          >
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 md:w-16 md:h-16 ${service.color} rounded-full flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-300 border-2 border-white/20`}>
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-white font-bold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-playfair font-semibold text-foreground text-sm md:text-base tracking-wide">
                  {service.title}
                </h3>
                <div className="w-8 h-0.5 bg-primary/30 mx-auto"></div>
                <p className="text-muted-foreground text-xs md:text-sm font-crimson italic">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceCategories;