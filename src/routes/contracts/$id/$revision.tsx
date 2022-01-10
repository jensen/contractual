import { useState, Fragment } from "react";
import type { LoaderFunction } from "remix";
import { useLoaderData, json, Link, useParams } from "remix";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import cx from "classnames";
import MarkdownPreview from "~/components/MarkdownPreview";
import { supabase } from "~/util/auth";

type IndexData = {};

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data, error } = await db
    .from("contracts")
    .select("*, revisions(*, editor:editor_id(*)), creator:creator_id(*)")
    .eq("id", params.id)
    .single();

  return json({ contract: data });
};

const RevisionList = (props) => {
  return (
    <ul className="flex flex-col-reverse">
      {props.revisions.map((revision, index) => {
        const current = Number(props.revision) === index;

        return (
          <Link to={`/contracts/${revision.contract_id}/${index}`}>
            <li className="flex space-x-2 items-center">
              <ChevronLeftIcon
                className={cx("h-5 w-5", {
                  "text-discord": current,
                  "text-transparent": current === false,
                })}
              />
              <div className="w-8 h-8">
                <img className="rounded-full" src={revision.editor.avatar} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-sm font-bold">{revision.editor.name}</h2>
                <h5 className="text-xs font-light text-gray-500">
                  {`0${revision.hash.slice(1, 16)}...`}
                </h5>
              </div>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

const View = (props) => {
  const { revision } = useParams();

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold text-2xl mb-4">{props.contract.name}</h2>
      <section className="h-full w-[96ch] flex">
        <div className="h-full flex flex-col space-y-4">
          <MarkdownPreview
            input={props.contract.revisions[Number(revision)].content}
          />
        </div>
        <div className="px-8 flex flex-col space-y-4">
          <Link
            to="edit"
            className="px-4 py-2 bg-discord text-white rounded-md"
          >
            Make Revision
          </Link>
          <RevisionList
            revision={revision}
            revisions={props.contract.revisions}
          />
        </div>
      </section>
    </div>
  );
};

export default function ViewContract() {
  let data = useLoaderData();

  return <View contract={data.contract} />;
}
