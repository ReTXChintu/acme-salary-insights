import { Box, Heading, Text } from "@chakra-ui/react";
import { createBrowserRouter } from "react-router-dom";

import {
  AnalyticsPage,
  AppShell,
  DashboardPage,
} from "../components/layout/AppShell";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box>
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      <Text mt="4" color="gray.600">
        Placeholder route for ACME Salary Insights.
      </Text>
    </Box>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "employees",
        element: <PlaceholderPage title="Employees" />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
]);
