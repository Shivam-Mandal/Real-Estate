/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { userService } from "../services/userService";

const PropertyToolsContext = createContext(null);
const GUEST_WISHLIST_KEY = "estate-guest-wishlist";
const COMPARE_KEY = "estate-compare-properties";

const parseStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const toCompareShape = (property) => ({
  _id: property._id,
  slug: property.slug,
  title: property.title,
  category: property.category,
  listingType: property.listingType,
  price: property.price,
  address: property.address,
  city: property.city,
  state: property.state,
  images: property.images || [],
  specs: property.specs || {},
});

export const PropertyToolsProvider = ({ children }) => {
  const { accessToken, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => parseStorage(GUEST_WISHLIST_KEY, []));
  const [compare, setCompare] = useState(() => parseStorage(COMPARE_KEY, []));
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [isAuthenticated, wishlist]);

  useEffect(() => {
    let mounted = true;

    const bootstrapWishlist = async () => {
      if (!isAuthenticated || !accessToken) {
        setWishlist(parseStorage(GUEST_WISHLIST_KEY, []));
        return;
      }

      setWishlistLoading(true);
      try {
        const guestWishlist = parseStorage(GUEST_WISHLIST_KEY, []);
        if (guestWishlist.length) {
          await Promise.allSettled(
            guestWishlist.map((property) => userService.addToWishlist(accessToken, property._id)),
          );
          localStorage.removeItem(GUEST_WISHLIST_KEY);
        }

        const data = await userService.getWishlist(accessToken);
        if (mounted) {
          setWishlist(data.items || []);
        }
      } catch {
        if (mounted) {
          setWishlist([]);
        }
      } finally {
        if (mounted) {
          setWishlistLoading(false);
        }
      }
    };

    bootstrapWishlist();

    return () => {
      mounted = false;
    };
  }, [accessToken, isAuthenticated]);

  const isWishlisted = (propertyId) => wishlist.some((item) => item._id === propertyId);
  const isCompared = (propertyId) => compare.some((item) => item._id === propertyId);

  const toggleWishlist = async (property) => {
    if (!property?._id) {
      return false;
    }

    const alreadySaved = isWishlisted(property._id);

    if (!isAuthenticated || !accessToken) {
      setWishlist((current) =>
        alreadySaved
          ? current.filter((item) => item._id !== property._id)
          : [toCompareShape(property), ...current].slice(0, 24),
      );
      return !alreadySaved;
    }

    setWishlistLoading(true);
    try {
      const data = alreadySaved
        ? await userService.removeFromWishlist(accessToken, property._id)
        : await userService.addToWishlist(accessToken, property._id);

      setWishlist(data.items || []);
      return !alreadySaved;
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleCompare = (property) => {
    if (!property?._id) {
      return false;
    }

    const alreadyAdded = isCompared(property._id);
    if (alreadyAdded) {
      setCompare((current) => current.filter((item) => item._id !== property._id));
      return false;
    }

    setCompare((current) => [...current, toCompareShape(property)].slice(-3));
    return true;
  };

  const clearCompare = () => setCompare([]);

  const value = {
    wishlist,
    compare,
    wishlistLoading,
    isWishlisted,
    isCompared,
    toggleWishlist,
    toggleCompare,
    clearCompare,
  };

  return <PropertyToolsContext.Provider value={value}>{children}</PropertyToolsContext.Provider>;
};

export const usePropertyTools = () => {
  const context = useContext(PropertyToolsContext);
  if (!context) {
    throw new Error("usePropertyTools must be used within PropertyToolsProvider");
  }

  return context;
};
