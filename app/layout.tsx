import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collège ABC",
  description: "Site du Collège ABC : formations, étudiants et gestion",
};

/*
  Layout racine : la navbar et le footer sont communs à toutes les pages.
  flex + min-h-screen : le footer reste en bas même si la page est courte.
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}
