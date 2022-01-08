import { useEffect } from "react";
import type { LoaderFunction } from "remix";
import { useLoaderData, json, useNavigate, useLocation } from "remix";
import { supabase } from "~/util/auth";
import { useSupabaseUser } from "~/context/supabase";

type IndexData = {};

export let loader: LoaderFunction = () => {
  return json({});
};

interface IIndexViewProps {}

const View = (props: IIndexViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirect = query.get("redirect_to");

  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect]);

  return <div>View</div>;
};

export default function Index() {
  let data = useLoaderData<IndexData>();

  return <View />;
}
