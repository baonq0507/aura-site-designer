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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="group bg-card rounded-xl p-3 md:p-4 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-border/50"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 ${service.color} rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:shadow-glow transition-all duration-300`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-black font-bold" />
            </div>
            <h3 className="font-semibold text-foreground text-xs md:text-sm mb-1">
              {service.title}
            </h3>
            <p className="text-muted-foreground text-xs">
              {service.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceCategories;