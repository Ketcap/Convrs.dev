import { Box, Flex } from "@mantine/core";
import Image from "next/image";

export const Header = () => {
  return (
    <Box
      w={{ xs: "100%", sm: "520px", md: "720px" }}
      m="auto"
      h={60}
      bg="rgba(57,57,57,.9)"
      sx={{
        borderRadius: 30,
        position: "absolute",
        top: 20,
        width: "100%",
      }}
      left={{ xs: "0", sm: "calc(50% - 260px)", md: "calc(50% - 360px)" }}
      p={{
        xs: "0 20px",
        sm: "0 30px",
        md: "0 40px",
      }}
    >
      <Flex align={"center"} h={"100%"}>
        <Image src="/logo.png" width={45} height={55} alt="Talk to AI logo" />

        {/* Login Signup */}
      </Flex>
    </Box>
  );
};
