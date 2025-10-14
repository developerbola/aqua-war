import { Toaster } from "@/components/ui/sonner";
import "./styles/globals.css";
import { JetBrains_Mono } from "next/font/google";

const jet = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jet",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Aqua War</title>
        <meta name="description" content="The sea battle game in web." />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`antialiased ${jet.className} font-[700]`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#000",
              borderRadius: 0,
              border: "none",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "500",
              padding: "10px 15px",
              width: "200px",
            },
          }}
        />
      </body>
    </html>
  );
}
