import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.15 },
    );

    els.forEach((el) => observer.observe(el));

    return () => {
      els.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return null;
}
