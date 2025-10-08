import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Small helper to convert a pathname to a readable title fragment
const pathToTitle = (pathname) => {
  if (!pathname || pathname === "/") return "Home";
  // remove leading/trailing slashes and split
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");
  // take last segment and pretty-print
  const last = parts[parts.length - 1] || parts[0];
  return last.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const PageTitle = ({ title, children, suffix = "The Booking Bot" }) => {
  const location = useLocation();

  useEffect(() => {
    // Prefer explicit title prop, then children content, then derive from path, finally fallback to suffix
    const childText = typeof children === "string" ? children.trim() : null;
    const safeTitle = title && String(title).trim()
      ? String(title).trim()
      : childText
      ? childText
      : pathToTitle(location.pathname || "/");

    document.title = safeTitle ? `${safeTitle}` : suffix;
  }, [location.pathname, title, children, suffix]);

  return null;
};

export default PageTitle;
