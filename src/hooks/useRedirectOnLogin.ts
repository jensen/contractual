import { useEffect } from "react";
import { useNavigate, useLocation } from "remix";

export default function useRedirectOnLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirect = query.get("redirect_to");

  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect]);
}
