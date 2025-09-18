import React from "react";

const MainLayout = async ({ children }) => {
  return <div className="container mx-auto mt-16 mb-16">{children}</div>;
};

export default MainLayout;
