import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { EmployeesPage } from "../features/employees/pages/EmployeesPage";
import { EmployeeDetailPage } from "../features/employees/pages/EmployeeDetailPage";

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
        path: "employees/:id",
        element: <EmployeeDetailPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
]);
