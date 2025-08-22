const sidebarItems = {
  ORG_ADMIN: [
    { name: "Dashboard", path: "/" },
    { name: "User Management", path: "/users" },
    { name: "Role Management", path: "/roles" },
    { name: "Settings", path: "/settings" },
    { name: "Reports", path: "/reports" },
  ],
  TEAM_LEAD: [
    { name: "Dashboard", path: "/" },
    { name: "Leads", path: "/leads" },
    { name: "Reports", path: "/reports" },
  ],
  EMPLOYEE: [
    { name: "Dashboard", path: "/" },
    { name: "My Leads", path: "/leads" },
  ],
};

export default sidebarItems;
