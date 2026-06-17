import { Box, Heading, Text } from "@chakra-ui/react";
import { createBrowserRouter } from "react-router-dom";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box p="8">
      <Heading as="h1" size="3xl">
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
    element: <PlaceholderPage title="Dashboard" />,
  },
  {
    path: "/employees",
    element: <PlaceholderPage title="Employees" />,
  },
  {
    path: "/analytics",
    element: <PlaceholderPage title="Analytics" />,
  },
]);
