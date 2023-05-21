import Background from "@/components/Common/Background";
import Header from "@/components/Common/Header";
import JoinModal from "@/components/Common/JoinModal";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./Providers";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <Background>
              <Header />
              <JoinModal />
              {children}
            </Background>
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
