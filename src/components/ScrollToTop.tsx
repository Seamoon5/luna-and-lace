import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sends the visitor back to the top of the page whenever they open a new page.
 *
 * Without this the browser keeps the scroll position from the page you just left,
 * so a long Home page leaves you stranded halfway down About or Returns.
 * The jump is instant - "smooth" would look like the page sliding in oddly.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // a real anchor link - let the browser find that section
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
