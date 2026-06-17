import { Box, Heading } from "@chakra-ui/react";

export function Navbar() {
  return (
    <Box
      as="header"
      aria-label="Navbar"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      px="6"
      py="4"
    >
      <Heading as="p" size="md">
        Hello HR Manager
      </Heading>
    </Box>
  );
}
