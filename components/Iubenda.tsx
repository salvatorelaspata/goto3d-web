"use client";
import { useEffect } from "react";

export const Iubenda = () => {
  useEffect(() => {
    const loader = () => {
      let s = document.createElement("script");
      let tag = document.getElementsByTagName("script")[0];
      s.src = "https://cdn.iubenda.com/iubenda.js";
      if (tag && tag.parentNode) tag.parentNode.insertBefore(s, tag);
    };

    if (window.addEventListener) {
      window.addEventListener("load", loader, false);
    } else {
      window.onload = loader;
    }
  }, []);

  return (
    <>
      <a
        href="https://www.iubenda.com/privacy-policy/64555463"
        className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe mx-2"
        title="Privacy Policy"
      >
        Privacy Policy
      </a>
      <a
        href="https://www.iubenda.com/privacy-policy/64555463/cookie-policy"
        className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe mx-2"
        title="Cookie Policy"
      >
        Cookie Policy
      </a>
    </>
  );
};
