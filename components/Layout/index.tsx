import { AppShell, Box } from "@mantine/core";
import { Navbar } from "@/components/Navbar";

export interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell
      navbar={<Navbar />}
      styles={{
        main: {
          position: "relative",
          paddingBottom: 0,
          height: "calc(100vh - 75px)",
        },
      }}
    >
      {children}
    </AppShell>
  );
};
