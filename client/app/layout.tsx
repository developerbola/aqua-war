import { Toaster } from "@/components/ui/sonner";
import "./styles/globals.css";
import Demo from "./demo";

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
      <body className={`antialiased`}>
        {/* {children} */}
        <Demo />
        <Toaster richColors />
      </body>
    </html>
  );
}
