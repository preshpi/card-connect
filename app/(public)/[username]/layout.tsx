import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Connect Profile",
  description: "View my Card Connect profile",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
