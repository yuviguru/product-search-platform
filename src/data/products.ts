import { Product, Category } from '../types/product'

// Enhanced product data based on DummyJSON structure with added specs
export const products: Product[] = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    description: "The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.",
    price: 1199,
    discountPercentage: 5.5,
    rating: 4.8,
    stock: 45,
    brand: "Apple",
    category: "smartphones",
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"],
    tags: ["5G", "ProMotion", "USB-C"],
    specs: {
      "Display": "6.7\" Super Retina XDR",
      "Processor": "A17 Pro",
      "RAM": "8GB",
      "Storage": "256GB",
      "Battery": "4422 mAh",
      "Camera": "48MP + 12MP + 12MP",
      "Weight": "221g"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0CHXQF5D5?tag=YOUR_TAG"
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    description: "Ultimate productivity with S Pen, AI features, and 200MP camera.",
    price: 1299,
    discountPercentage: 8,
    rating: 4.7,
    stock: 32,
    brand: "Samsung",
    category: "smartphones",
    thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"],
    tags: ["5G", "S Pen", "AI"],
    specs: {
      "Display": "6.8\" Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Storage": "256GB",
      "Battery": "5000 mAh",
      "Camera": "200MP + 12MP + 50MP + 10MP",
      "Weight": "232g"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0CMDL3H3P?tag=YOUR_TAG"
  },
  {
    id: 3,
    title: "Google Pixel 8 Pro",
    description: "The best of Google AI with exceptional camera and 7 years of updates.",
    price: 999,
    discountPercentage: 10,
    rating: 4.6,
    stock: 28,
    brand: "Google",
    category: "smartphones",
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"],
    tags: ["5G", "AI", "Clean Android"],
    specs: {
      "Display": "6.7\" LTPO OLED",
      "Processor": "Tensor G3",
      "RAM": "12GB",
      "Storage": "128GB",
      "Battery": "5050 mAh",
      "Camera": "50MP + 48MP + 48MP",
      "Weight": "213g"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0CGTJ12Z9?tag=YOUR_TAG"
  },
  {
    id: 4,
    title: "MacBook Pro 16\" M3 Max",
    description: "Supercharged by M3 Max chip for unprecedented performance.",
    price: 3499,
    discountPercentage: 0,
    rating: 4.9,
    stock: 15,
    brand: "Apple",
    category: "laptops",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"],
    tags: ["M3 Max", "ProMotion", "MagSafe"],
    specs: {
      "Display": "16.2\" Liquid Retina XDR",
      "Processor": "Apple M3 Max",
      "RAM": "36GB",
      "Storage": "1TB SSD",
      "Battery": "22 hours",
      "Weight": "2.14 kg",
      "Ports": "3x Thunderbolt 4, HDMI, SD, MagSafe"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0CM5JVGPZ?tag=YOUR_TAG"
  },
  {
    id: 5,
    title: "Dell XPS 15",
    description: "Premium Windows laptop with stunning OLED display and powerful specs.",
    price: 1899,
    discountPercentage: 12,
    rating: 4.5,
    stock: 22,
    brand: "Dell",
    category: "laptops",
    thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800"],
    tags: ["OLED", "Intel Core i9", "Thunderbolt"],
    specs: {
      "Display": "15.6\" 3.5K OLED",
      "Processor": "Intel Core i9-13900H",
      "RAM": "32GB",
      "Storage": "1TB SSD",
      "Battery": "13 hours",
      "Weight": "1.86 kg",
      "Graphics": "NVIDIA RTX 4070"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0C5J7PCRN?tag=YOUR_TAG"
  },
  {
    id: 6,
    title: "ThinkPad X1 Carbon Gen 11",
    description: "Ultimate business laptop with legendary reliability.",
    price: 1649,
    discountPercentage: 15,
    rating: 4.6,
    stock: 18,
    brand: "Lenovo",
    category: "laptops",
    thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"],
    tags: ["Business", "Lightweight", "5G"],
    specs: {
      "Display": "14\" 2.8K OLED",
      "Processor": "Intel Core i7-1365U",
      "RAM": "16GB",
      "Storage": "512GB SSD",
      "Battery": "15 hours",
      "Weight": "1.12 kg",
      "Ports": "2x Thunderbolt 4, 2x USB-A, HDMI"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0BWSPN2ZD?tag=YOUR_TAG"
  },
  {
    id: 7,
    title: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation with exceptional sound quality.",
    price: 399,
    discountPercentage: 20,
    rating: 4.8,
    stock: 67,
    brand: "Sony",
    category: "headphones",
    thumbnail: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800"],
    tags: ["ANC", "Wireless", "Hi-Res"],
    specs: {
      "Type": "Over-ear",
      "Driver": "30mm",
      "Frequency": "4Hz - 40kHz",
      "Battery": "30 hours",
      "ANC": "Yes",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.2, 3.5mm"
    },
    affiliateUrl: "https://www.amazon.com/dp/B09XS7JWHH?tag=YOUR_TAG"
  },
  {
    id: 8,
    title: "Bose QuietComfort Ultra",
    description: "Immersive audio with world-class noise cancellation.",
    price: 429,
    discountPercentage: 10,
    rating: 4.7,
    stock: 45,
    brand: "Bose",
    category: "headphones",
    thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800"],
    tags: ["ANC", "Spatial Audio", "Wireless"],
    specs: {
      "Type": "Over-ear",
      "Driver": "35mm",
      "Frequency": "10Hz - 30kHz",
      "Battery": "24 hours",
      "ANC": "Yes",
      "Weight": "252g",
      "Connectivity": "Bluetooth 5.3, 3.5mm"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0CCZ1L489?tag=YOUR_TAG"
  },
  {
    id: 9,
    title: "AirPods Pro 2",
    description: "Rebuilt from the sound up with H2 chip and Adaptive Audio.",
    price: 249,
    discountPercentage: 5,
    rating: 4.7,
    stock: 120,
    brand: "Apple",
    category: "headphones",
    thumbnail: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800"],
    tags: ["ANC", "Spatial Audio", "MagSafe"],
    specs: {
      "Type": "In-ear",
      "Driver": "Custom Apple",
      "Frequency": "20Hz - 20kHz",
      "Battery": "6 hours (30 with case)",
      "ANC": "Yes",
      "Weight": "5.3g each",
      "Connectivity": "Bluetooth 5.3"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0D1XD1ZV3?tag=YOUR_TAG"
  },
  {
    id: 10,
    title: "iPad Pro 12.9\" M2",
    description: "The ultimate iPad experience with M2 chip and stunning display.",
    price: 1099,
    discountPercentage: 8,
    rating: 4.8,
    stock: 35,
    brand: "Apple",
    category: "tablets",
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"],
    tags: ["M2", "ProMotion", "Face ID"],
    specs: {
      "Display": "12.9\" Liquid Retina XDR",
      "Processor": "Apple M2",
      "RAM": "8GB",
      "Storage": "256GB",
      "Battery": "10 hours",
      "Weight": "682g",
      "Connectivity": "WiFi 6E, 5G optional"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0BJLCWFNM?tag=YOUR_TAG"
  },
  {
    id: 11,
    title: "Samsung Galaxy Tab S9 Ultra",
    description: "Largest Galaxy Tab with stunning AMOLED display.",
    price: 1199,
    discountPercentage: 12,
    rating: 4.6,
    stock: 25,
    brand: "Samsung",
    category: "tablets",
    thumbnail: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800"],
    tags: ["S Pen", "DeX", "AMOLED"],
    specs: {
      "Display": "14.6\" Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 2",
      "RAM": "12GB",
      "Storage": "256GB",
      "Battery": "11,200 mAh",
      "Weight": "732g",
      "Connectivity": "WiFi 6E, 5G optional"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0C4BCMRHD?tag=YOUR_TAG"
  },
  {
    id: 12,
    title: "Apple Watch Ultra 2",
    description: "The most rugged and capable Apple Watch for extreme adventures.",
    price: 799,
    discountPercentage: 0,
    rating: 4.9,
    stock: 40,
    brand: "Apple",
    category: "smartwatches",
    thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
    images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800"],
    tags: ["GPS", "Dive Computer", "Titanium"],
    specs: {
      "Display": "49mm OLED",
      "Processor": "S9 SiP",
      "Battery": "36 hours",
      "Water Resistance": "100m",
      "Weight": "61.3g",
      "GPS": "Dual-frequency",
      "Material": "Titanium"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0CHX9N594?tag=YOUR_TAG"
  },
  {
    id: 13,
    title: "Samsung Galaxy Watch 6 Classic",
    description: "Classic design meets cutting-edge technology.",
    price: 399,
    discountPercentage: 15,
    rating: 4.5,
    stock: 55,
    brand: "Samsung",
    category: "smartwatches",
    thumbnail: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800"],
    tags: ["Rotating Bezel", "BioActive Sensor", "Wear OS"],
    specs: {
      "Display": "47mm Super AMOLED",
      "Processor": "Exynos W930",
      "Battery": "40 hours",
      "Water Resistance": "50m",
      "Weight": "59g",
      "GPS": "Yes",
      "Material": "Stainless Steel"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0C79595NM?tag=YOUR_TAG"
  },
  {
    id: 14,
    title: "Sony A7 IV",
    description: "Full-frame mirrorless camera for photo and video creators.",
    price: 2498,
    discountPercentage: 5,
    rating: 4.8,
    stock: 12,
    brand: "Sony",
    category: "cameras",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
    tags: ["Full Frame", "4K 60fps", "IBIS"],
    specs: {
      "Sensor": "33MP Full Frame",
      "ISO": "100-51200",
      "Video": "4K 60fps",
      "Stabilization": "5-axis IBIS",
      "AF Points": "759",
      "Weight": "659g",
      "Battery": "580 shots"
    },
    affiliateUrl: "https://www.amazon.com/dp/B09JZT6YK5?tag=YOUR_TAG"
  },
  {
    id: 15,
    title: "Canon EOS R6 Mark II",
    description: "High-speed full-frame mirrorless for sports and wildlife.",
    price: 2499,
    discountPercentage: 8,
    rating: 4.7,
    stock: 18,
    brand: "Canon",
    category: "cameras",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800"],
    tags: ["Full Frame", "40fps", "6K Raw"],
    specs: {
      "Sensor": "24.2MP Full Frame",
      "ISO": "100-102400",
      "Video": "6K Raw, 4K 60fps",
      "Stabilization": "8-stop IBIS",
      "AF Points": "1053",
      "Weight": "670g",
      "Battery": "760 shots"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0BLK41D54?tag=YOUR_TAG"
  },
  {
    id: 16,
    title: "LG C3 65\" OLED TV",
    description: "Perfect blacks and infinite contrast for cinematic viewing.",
    price: 1799,
    discountPercentage: 20,
    rating: 4.8,
    stock: 25,
    brand: "LG",
    category: "televisions",
    thumbnail: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"],
    tags: ["OLED", "4K", "120Hz", "Dolby Vision"],
    specs: {
      "Display": "65\" OLED evo",
      "Resolution": "4K UHD",
      "Refresh Rate": "120Hz",
      "HDR": "Dolby Vision, HDR10",
      "Smart TV": "webOS 23",
      "HDMI": "4x HDMI 2.1",
      "Gaming": "VRR, ALLM, G-Sync"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0BVXF72HV?tag=YOUR_TAG"
  },
  {
    id: 17,
    title: "Samsung 75\" Neo QLED 8K",
    description: "Next-level 8K resolution with Quantum Matrix Technology.",
    price: 3499,
    discountPercentage: 15,
    rating: 4.6,
    stock: 10,
    brand: "Samsung",
    category: "televisions",
    thumbnail: "https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=400",
    images: ["https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=800"],
    tags: ["8K", "Neo QLED", "144Hz"],
    specs: {
      "Display": "75\" Neo QLED",
      "Resolution": "8K UHD",
      "Refresh Rate": "144Hz",
      "HDR": "HDR10+, Quantum HDR",
      "Smart TV": "Tizen",
      "HDMI": "4x HDMI 2.1",
      "Gaming": "Game Motion Plus"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0BWGGJP7G?tag=YOUR_TAG"
  },
  {
    id: 18,
    title: "PlayStation 5",
    description: "Next-gen gaming with lightning-fast SSD and ray tracing.",
    price: 499,
    discountPercentage: 0,
    rating: 4.9,
    stock: 30,
    brand: "Sony",
    category: "gaming",
    thumbnail: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800"],
    tags: ["4K", "Ray Tracing", "SSD"],
    specs: {
      "CPU": "AMD Zen 2, 8 cores",
      "GPU": "10.28 TFLOPS",
      "RAM": "16GB GDDR6",
      "Storage": "825GB SSD",
      "Resolution": "Up to 8K",
      "Frame Rate": "Up to 120fps",
      "Disc": "4K Blu-ray"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0BCNKKZ91?tag=YOUR_TAG"
  },
  {
    id: 19,
    title: "Xbox Series X",
    description: "Most powerful Xbox ever with 12 teraflops of power.",
    price: 499,
    discountPercentage: 5,
    rating: 4.8,
    stock: 35,
    brand: "Microsoft",
    category: "gaming",
    thumbnail: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400",
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800"],
    tags: ["4K", "Ray Tracing", "Game Pass"],
    specs: {
      "CPU": "AMD Zen 2, 8 cores",
      "GPU": "12 TFLOPS",
      "RAM": "16GB GDDR6",
      "Storage": "1TB SSD",
      "Resolution": "Up to 8K",
      "Frame Rate": "Up to 120fps",
      "Disc": "4K Blu-ray"
    },
    affiliateUrl: "https://www.amazon.com/dp/B08H75RTZ8?tag=YOUR_TAG"
  },
  {
    id: 20,
    title: "Nintendo Switch OLED",
    description: "Vibrant OLED screen for handheld and TV gaming.",
    price: 349,
    discountPercentage: 0,
    rating: 4.7,
    stock: 80,
    brand: "Nintendo",
    category: "gaming",
    thumbnail: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
    images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800"],
    tags: ["OLED", "Portable", "Docked"],
    specs: {
      "Display": "7\" OLED",
      "Resolution": "1280x720 handheld",
      "Storage": "64GB",
      "Battery": "4.5-9 hours",
      "Docked Output": "1080p",
      "Weight": "420g",
      "Connectivity": "WiFi, Bluetooth"
    },
    affiliateUrl: "https://www.amazon.com/dp/B098RKWHHZ?tag=YOUR_TAG"
  },
  {
    id: 21,
    title: "Dyson V15 Detect",
    description: "Intelligent vacuum with laser dust detection.",
    price: 749,
    discountPercentage: 10,
    rating: 4.7,
    stock: 40,
    brand: "Dyson",
    category: "home-appliances",
    thumbnail: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
    images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800"],
    tags: ["Cordless", "Laser", "HEPA"],
    specs: {
      "Suction": "230 AW",
      "Runtime": "60 minutes",
      "Bin": "0.76L",
      "Weight": "3.1kg",
      "Filtration": "HEPA",
      "Display": "LCD screen",
      "Laser": "Green laser dust detection"
    },
    affiliateUrl: "https://www.amazon.com/dp/B0932M1CKG?tag=YOUR_TAG"
  },
  {
    id: 22,
    title: "Roomba j7+",
    description: "Smart robot vacuum with obstacle avoidance.",
    price: 799,
    discountPercentage: 25,
    rating: 4.5,
    stock: 55,
    brand: "iRobot",
    category: "home-appliances",
    thumbnail: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400",
    images: ["https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800"],
    tags: ["Robot", "Auto-Empty", "Smart Mapping"],
    specs: {
      "Navigation": "PrecisionVision",
      "Runtime": "75 minutes",
      "Bin": "Auto-empty base",
      "Suction": "10x Power-Lifting",
      "Smart Home": "Alexa, Google",
      "Mapping": "Imprint Smart Maps",
      "Obstacle": "P.O.O.P. (Pet Owner Promise)"
    },
    affiliateUrl: "https://www.amazon.com/dp/B094NYHTMF?tag=YOUR_TAG"
  },
  {
    id: 23,
    title: "Nespresso Vertuo Plus",
    description: "Barista-quality coffee at the touch of a button.",
    price: 189,
    discountPercentage: 20,
    rating: 4.6,
    stock: 90,
    brand: "Nespresso",
    category: "home-appliances",
    thumbnail: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800"],
    tags: ["Centrifusion", "One-Touch", "Automatic"],
    specs: {
      "Brew System": "Centrifusion",
      "Cup Sizes": "5 (40-414ml)",
      "Water Tank": "1.1L",
      "Pressure": "19 bar",
      "Heat-up": "15 seconds",
      "Auto-off": "9 minutes",
      "Capsule": "Vertuo pods"
    },
    affiliateUrl: "https://www.amazon.com/dp/B01MFGN4HF?tag=YOUR_TAG"
  },
  {
    id: 24,
    title: "Herman Miller Aeron",
    description: "Iconic ergonomic office chair for all-day comfort.",
    price: 1395,
    discountPercentage: 0,
    rating: 4.8,
    stock: 20,
    brand: "Herman Miller",
    category: "furniture",
    thumbnail: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800"],
    tags: ["Ergonomic", "Mesh", "Adjustable"],
    specs: {
      "Material": "8Z Pellicle mesh",
      "Adjustments": "Tilt, arms, lumbar",
      "Sizes": "A, B, C",
      "Max Weight": "350 lbs",
      "Warranty": "12 years",
      "Certification": "BIFMA, GREENGUARD",
      "Made In": "USA"
    },
    affiliateUrl: "https://www.amazon.com/dp/B01N0ZUN46?tag=YOUR_TAG"
  },
  {
    id: 25,
    title: "Secretlab Titan Evo",
    description: "Premium gaming chair with 4-way lumbar support.",
    price: 519,
    discountPercentage: 10,
    rating: 4.7,
    stock: 45,
    brand: "Secretlab",
    category: "furniture",
    thumbnail: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400",
    images: ["https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800"],
    tags: ["Gaming", "4D Armrests", "Magnetic Pillow"],
    specs: {
      "Material": "NEO Hybrid Leatherette",
      "Lumbar": "4-way L-ADAPT",
      "Recline": "165 degrees",
      "Max Weight": "395 lbs",
      "Warranty": "5 years",
      "Armrests": "4D CloudSwap",
      "Base": "ADC12 Aluminum"
    },
    affiliateUrl: "https://www.amazon.com/dp/B09ZTRTVN2?tag=YOUR_TAG"
  }
]

// Categories with counts
export const categories: Category[] = [
  { slug: 'smartphones', name: 'Smartphones', count: products.filter(p => p.category === 'smartphones').length },
  { slug: 'laptops', name: 'Laptops', count: products.filter(p => p.category === 'laptops').length },
  { slug: 'headphones', name: 'Headphones', count: products.filter(p => p.category === 'headphones').length },
  { slug: 'tablets', name: 'Tablets', count: products.filter(p => p.category === 'tablets').length },
  { slug: 'smartwatches', name: 'Smartwatches', count: products.filter(p => p.category === 'smartwatches').length },
  { slug: 'cameras', name: 'Cameras', count: products.filter(p => p.category === 'cameras').length },
  { slug: 'televisions', name: 'Televisions', count: products.filter(p => p.category === 'televisions').length },
  { slug: 'gaming', name: 'Gaming', count: products.filter(p => p.category === 'gaming').length },
  { slug: 'home-appliances', name: 'Home Appliances', count: products.filter(p => p.category === 'home-appliances').length },
  { slug: 'furniture', name: 'Furniture', count: products.filter(p => p.category === 'furniture').length },
]

// Get unique brands
export const brands = [...new Set(products.map(p => p.brand))].map(brand => ({
  name: brand,
  count: products.filter(p => p.brand === brand).length
})).sort((a, b) => b.count - a.count)

// Price range - use very wide default to accommodate any currency/data source (Airtable INR products)
export const priceRange = {
  min: 0,
  max: 10000000  // 1 crore - wide enough for INR products
}

// Helper functions
export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getProductsByBrand(brand: string): Product[] {
  return products.filter(p => p.brand === brand)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100))
}
