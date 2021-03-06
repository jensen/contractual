import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  json,
  useLoaderData,
  Link,
} from "remix";
import type { LoaderFunction, MetaFunction, LinksFunction } from "remix";

import DiscordButton from "~/components/DiscordButton";

import SupabaseProvider from "~/context/supabase";
import WalletProvider from "~/context/wallet";
import AgreementProvider from "./context/agreement";

import { ethers } from "ethers";

import create from "~/util/session.server";

import libStyles from "~/styles/lib.css";

export let meta: MetaFunction = () => {
  return {
    title: "Contractual",
    description: "A contract based contract verification.",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: libStyles }];
};

export let loader: LoaderFunction = async ({ request }) => {
  const { getSession } = create();

  const session = await getSession(request.headers.get("Cookie"));

  const token = session.get("token");

  return json({
    token,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
};

export default function App() {
  let { env, token } = useLoaderData();

  return (
    <Document>
      <Environment env={env} />
      <SupabaseProvider token={token}>
        <WalletProvider>
          <AgreementProvider>
            <Layout>
              <Outlet />
            </Layout>
          </AgreementProvider>
        </WalletProvider>
      </SupabaseProvider>
    </Document>
  );
}

function Environment({ env }: { env: IEnvironment }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.env = ${JSON.stringify(env)}`,
      }}
    />
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full flex flex-col">
      <header className="px-4 py-2 text-discord flex justify-between items-center border-b-4 border-discord">
        <h2 className="text-xl">
          <Link to="/">
            <span className="font-bold">contr</span>
            <span className="font-light">actual</span>
          </Link>
        </h2>
        <DiscordButton />
      </header>
      <div className="p-4 flex-1">{children}</div>
      <footer className="px-4 py-2 bg-discord text-white">
        made by <a href="https://github.com/jensen">@jensen</a>
      </footer>
    </main>
  );
}
