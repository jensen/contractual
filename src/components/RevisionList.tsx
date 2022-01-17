import { Link } from "remix";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import cx from "classnames";
import { format } from "date-fns";
import Chain from "~/components/Chain";

interface IRevisionListProps {
  revisions: any[];
  revision: any;
}

export default function RevisionList(props: IRevisionListProps) {
  return (
    <ul className="flex flex-col space-y-2">
      {props.revisions.map((revision, index: number) => {
        const revisionIndex = props.revisions.length - index - 1;
        const current = Number(props.revision) === revisionIndex;

        return (
          <li key={revision.hash} className="bg-gray-100 p-2 pr-4 rounded-xl">
            <section className="flex flex-col space-x-2">
              <Link
                className="flex items-center space-x-2"
                to={`/contracts/${revision.contract_id}/revisions/${revisionIndex}`}
              >
                <ChevronLeftIcon
                  className={cx("h-8 w-8", {
                    "text-discord": current,
                    "text-transparent": current === false,
                  })}
                />
                <img
                  className="w-8 h-8 rounded-full item-start"
                  src={revision.editor.avatar}
                />
                <div className="flex flex-col justify-center">
                  <h2 className="text-sm font-bold">{revision.editor.name}</h2>
                  <h5 className="font-mono text-xs text-gray-600">
                    {`${revision.hash.slice(0, 32)}...${revision.hash.slice(
                      62
                    )}`}
                  </h5>
                  <h5 className="text-xs text-gray-400">
                    {format(new Date(revision.created_at), "MMMM Do, yyyy")}
                  </h5>
                </div>
              </Link>
              <section className="flex space-x-2 justify-end pt-2">
                <Chain
                  address={revision.chain_address}
                  revision={revisionIndex}
                  newest={index === 0}
                />
              </section>
            </section>
          </li>
        );
      })}
    </ul>
  );
}
