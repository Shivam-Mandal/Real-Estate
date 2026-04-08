import { useEffect } from "react";

const ensureMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
};

export const useSeo = ({ title, description, image, canonical }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descriptionTag = ensureMeta('meta[name="description"]', { name: "description" });
    const ogTitleTag = ensureMeta('meta[property="og:title"]', { property: "og:title" });
    const ogDescriptionTag = ensureMeta('meta[property="og:description"]', { property: "og:description" });
    const ogImageTag = ensureMeta('meta[property="og:image"]', { property: "og:image" });
    const canonicalLink =
      document.head.querySelector('link[rel="canonical"]') || document.createElement("link");

    descriptionTag.setAttribute("content", description);
    ogTitleTag.setAttribute("content", title);
    ogDescriptionTag.setAttribute("content", description);
    ogImageTag.setAttribute("content", image || "");

    canonicalLink.setAttribute("rel", "canonical");
    canonicalLink.setAttribute("href", canonical || window.location.href);
    if (!canonicalLink.parentNode) {
      document.head.appendChild(canonicalLink);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [canonical, description, image, title]);
};
