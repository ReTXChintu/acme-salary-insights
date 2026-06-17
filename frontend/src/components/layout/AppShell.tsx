import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />
      <Flex direction="column" flex="1" minW="0">
        <Navbar />
        <Box as="main" flex="1" p="6">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}

export function DashboardPage() {
  return (
    <Box>
      <Heading as="h1" size="2xl">
        Dashboard
      </Heading>
      <Text mt="4" color="gray.600">
        Welcome to ACME Salary Insights.
      </Text>
    </Box>
  );
}

export function AnalyticsPage() {
  return (
    <Box>
      <Heading as="h1" size="2xl">
        Analytics
      </Heading>
      <Text mt="4" color="gray.600">
        Salary analytics will appear here.
      </Text>
    </Box>
  );
}

export function PlaceholderNavLink({
  to,
  children,
}: {
  to: string;
  children: string;
}) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.375rem",
        fontWeight: isActive ? 600 : 500,
        background: isActive ? "var(--chakra-colors-blue-50)" : "transparent",
        color: isActive
          ? "var(--chakra-colors-blue-700)"
          : "var(--chakra-colors-gray-700)",
        textDecoration: "none",
      })}
    >
      {children}
    </NavLink>
  );
}
