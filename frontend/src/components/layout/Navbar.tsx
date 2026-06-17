import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";

import { HamburgerIcon } from "./HamburgerIcon";

type NavbarProps = {
  onOpenMobileNav: () => void;
};

export function Navbar({ onOpenMobileNav }: NavbarProps) {
  return (
    <Box
      as="header"
      aria-label="Navbar"
      position="sticky"
      top="0"
      zIndex="sticky"
      flexShrink={0}
      bg="white"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      borderBottomWidth="1px"
      borderColor="gray.200"
      px={{ base: 4, md: 6 }}
      py="4"
    >
      <Flex justify="space-between" align="center" gap="4">
        <IconButton
          aria-label="Open navigation menu"
          display={{ base: "inline-flex", md: "none" }}
          variant="outline"
          size="sm"
          onClick={onOpenMobileNav}
        >
          <HamburgerIcon />
        </IconButton>
        <Flex flex="1" justify="flex-end" align="center">
          <Heading as="p" size="md">
            Hello HR Manager
          </Heading>
        </Flex>
      </Flex>
    </Box>
  );
}
