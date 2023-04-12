import { useEffect } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";

export const Spotlight = () => {
  const spotlight = useSpotlight();
  const { toggleColorScheme } = useMantineColorScheme();
  useEffect(() => {
    spotlight.registerActions([
      {
        id: "toggle-color",
        title: "Toggle Color Scheme",
        description: "Change theme from light to dark and vice versa",
        onTrigger: () => {
          toggleColorScheme();
        },
      },
    ]);
    return () => {
      spotlight.removeActions(["toggle-color"]);
    };
  }, []);

  return null;
};
