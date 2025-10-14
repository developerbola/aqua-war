"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"light"}
      className="toaster group"
      style={{ fontFamily: "var(--font-jet)" }}
      {...props}
    />
  );
};

export { Toaster };
