import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mambas Admin Dashboard | Mambas Tattoo & Cuts",
  description:
    "Admin dashboard for Mambas Tattoo & Cuts with client, reservation, deposit and loyalty insights.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#050505] text-white">{children}</div>;
}
