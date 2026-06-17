import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { MobileNavDrawer } from "./MobileNavDrawer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Flex h="100vh" overflow="hidden" bg="gray.50" _dark={{ bg: "gray.950" }}>
      <Sidebar />
      <Flex
        direction="column"
        flex="1"
        minW="0"
        h="100vh"
        overflow="hidden"
      >
        <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <Box as="main" flex="1" overflowY="auto" p={{ base: 4, md: 6 }}>
          <Outlet />
        </Box>
      </Flex>
      <MobileNavDrawer
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />
    </Flex>
  );
}

export function PlaceholderNavLink({
  to,
  children,
  onNavigate,
}: {
  to: string;
  children: string;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      style={({ isActive }) => ({
        display: "block",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.375rem",
        fontWeight: isActive ? 600 : 500,
        background: isActive
          ? "var(--chakra-colors-blue-50)"
          : "transparent",
        color: isActive
          ? "var(--chakra-colors-blue-700)"
          : "var(--chakra-colors-gray-700)",
        textDecoration: "none",
      })}
      className={({ isActive }) => (isActive ? "nav-link-active" : "nav-link")}
    >
      {children}
    </NavLink>
  );
}
