import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Sculpture = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
      <div>
        
      </div>
  );
};

export default Sculpture;