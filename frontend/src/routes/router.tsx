import { createBrowserRouter } from "react-router-dom";

import {
  AnalyticsPage,
  AppShell,
  DashboardPage,
} from "../components/layout/AppShell";
import { EmployeesPage } from "../features/employees/pages/EmployeesPage";

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
        element: <EmployeesPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
]);
