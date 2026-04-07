import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { User } from "../models/User.js";

const demoProperties = (ownerId) => [
  {
    title: "Skyline Horizon Penthouse",
    description:
      "A signature penthouse with skyline views, private terrace, concierge access, and refined finishes throughout.",
    category: "penthouse",
    listingType: "sale",
    status: "active",
    price: 1450000,
    featured: true,
    address: "12 Aurora Heights",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipCode: "400001",
    specs: { beds: 4, baths: 4, area: 3200, garage: 2, yearBuilt: 2022 },
    amenities: ["Infinity Pool", "Sky Deck", "Private Elevator", "Gym"],
    images: [{ url: "https://images.unsplash.com/photo-1502005097973-6a7082348e28", publicId: "demo-1" }],
    owner: ownerId,
  },
  {
    title: "Harbor View Family Villa",
    description:
      "A warm family villa with landscaped gardens, home office, entertainment lounge, and seamless indoor-outdoor living.",
    category: "villa",
    listingType: "sale",
    status: "active",
    price: 980000,
    featured: true,
    address: "88 Palm Residency",
    city: "Goa",
    state: "Goa",
    country: "India",
    zipCode: "403001",
    specs: { beds: 5, baths: 4, area: 4100, garage: 3, yearBuilt: 2021 },
    amenities: ["Garden", "Pool", "Home Office", "Security"],
    images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", publicId: "demo-2" }],
    owner: ownerId,
  },
  {
    title: "Urban Loft for Rent",
    description:
      "A flexible downtown loft designed for modern professionals, with coworking lounge access and curated interiors.",
    category: "apartment",
    listingType: "rent",
    status: "active",
    price: 2500,
    featured: false,
    address: "44 Central Loop",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    zipCode: "560001",
    specs: { beds: 2, baths: 2, area: 1450, garage: 1, yearBuilt: 2023 },
    amenities: ["Coworking", "Smart Home", "Gym", "Parking"],
    images: [{ url: "https://images.unsplash.com/photo-1494526585095-c41746248156", publicId: "demo-3" }],
    owner: ownerId,
  },
];

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Inquiry.deleteMany({}),
    RefreshToken.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@estate.com",
    password: "Admin@123",
    role: "admin",
    phone: "+91 9988776655",
  });

  const buyer = await User.create({
    name: "Sarah Buyer",
    email: "buyer@estate.com",
    password: "Buyer@123",
    role: "user",
    phone: "+91 9911223344",
  });

  const properties = await Property.insertMany(demoProperties(admin._id));

  await Inquiry.create({
    property: properties[0]._id,
    user: buyer._id,
    name: buyer.name,
    email: buyer.email,
    phone: buyer.phone,
    message: "I would like to schedule a viewing this weekend.",
    status: "new",
  });

  console.log("Seed completed");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
