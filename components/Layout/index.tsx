import { AppShell, Box } from "@mantine/core";
import { Navbar } from "@/components/Navbar";
import { Header } from "@/components/Header";

export interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell
      navbar={<Navbar />}
      header={<Header />}
      styles={{
        main: {
          position: "relative",
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: "calc(100vh - 75px - 55px)",
          // Bottom Bar and Header height
          height: "calc(100vh - 55px)",
        },
      }}
    >
      {children}
    </AppShell>
  );
};
