import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Luxury Perfume",
    price: "$299",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
    category: "Fragrance"
  },
  {
    id: 2,
    name: "Premium Watch",
    price: "$1,299",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
    category: "Timepiece"
  },
  {
    id: 3,
    name: "Designer Furniture",
    price: "$2,499",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    category: "Home"
  },
  {
    id: 4,
    name: "Crystal Chandelier",
    price: "$3,999",
    image: "https://images.unsplash.com/photo-1518053914092-7334f7de1a77?w=300&h=300&fit=crop",
    category: "Lighting"
  },
  {
    id: 5,
    name: "Luxury Lipstick Set",
    price: "$199",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop",
    category: "Beauty"
  },
  {
    id: 6,
    name: "Executive Desk",
    price: "$1,899",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
    category: "Office"
  },
  {
    id: 7,
    name: "Premium Headphones",
    price: "$599",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "Electronics"
  },
  {
    id: 8,
    name: "Gold Record Player",
    price: "$899",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    category: "Audio"
  },
  {
    id: 9,
    name: "Designer Belt",
    price: "$399",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "Fashion"
  },
  {
    id: 10,
    name: "Professional Camera",
    price: "$2,299",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
    category: "Photography"
  },
  {
    id: 11,
    name: "Luxury Handbag",
    price: "$1,599",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
    category: "Fashion"
  },
  {
    id: 12,
    name: "Premium Sneakers",
    price: "$699",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    category: "Footwear"
  }
];

const ProductRecommendations = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">RECOMMENDED PRODUCTS</h2>
        <p className="text-muted-foreground">Curated premium collection for discerning customers</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-card rounded-xl overflow-hidden shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 border border-border/50"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-accent/20">
                  <Heart className="h-4 w-4 text-accent" />
                </Button>
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="luxury" size="sm" className="w-full text-xs">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
            
            <div className="p-3 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="font-medium text-foreground text-sm line-clamp-2">
                  {product.name}
                </h3>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-accent">
                  {product.price}
                </span>
                <Button variant="copper" size="sm" className="h-6 px-2 text-xs">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;