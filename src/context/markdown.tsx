import { SupabaseClient, AuthUser } from "@supabase/supabase-js";
import React, { useEffect, useState, useContext } from "react";
import markdown from "markdown-wasm/dist/markdown.es.js";

async function init() {
  await markdown.ready;
}

function parse(input: string) {
  return markdown.parse(input);
}

type IMarkdownContext = (s: string) => string;

const MarkdownContext = React.createContext<IMarkdownContext>(parse);

interface IMarkdownProviderProps {
  children: React.ReactNode;
}

export default function MarkdownProvider(props: IMarkdownProviderProps) {
  useEffect(() => {
    init();
  }, []);

  return (
    <MarkdownContext.Provider value={parse}>
      {props.children}
    </MarkdownContext.Provider>
  );
}

export const useMarkdown = () => {
  return useContext(MarkdownContext);
};
