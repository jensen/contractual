/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

type EnvironemntVars =
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "COOKIE_SESSION_KEY_A"
  | "COOKIE_SESSION_KEY_B"
  | "CLIENT_URL"
  | "POLYGON_URL"
  | "SIGNER_PRIVATE_KEY";

type WindowWithEthereum = Window &
  typeof globalThis & {
    ethereum: any;
  };

type WindowWithEnvironment = Window &
  typeof globalThis & {
    env: Record<EnvironemntVars, "string">;
  };

interface IEnvironment extends Record<EnvironemntVars, string> {}
