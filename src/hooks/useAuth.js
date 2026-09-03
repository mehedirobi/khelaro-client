import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const useAuth = () => {
  const authInfo = useContext(AuthContext);

  if (!authInfo) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return authInfo;
};

export default useAuth;