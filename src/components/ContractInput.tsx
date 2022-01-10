import { useState } from "react";
import MarkdownPreview from "~/components/MarkdownPreview";

export default function ContractInput(props) {
  const [contract, setContract] = useState(props.content || "");

  return (
    <div className="h-full w-full flex  space-x-6">
      <section className="w-1/2">
        <textarea
          name="content"
          className="h-full w-full p-2 border shadow-slate-700/10 border-gray-900/5 bg-white focus:outline-none resize-none"
          placeholder="Write contract here..."
          value={contract}
          onChange={(event) => setContract(event.target.value)}
        />
      </section>
      <section className="w-1/2">
        <MarkdownPreview input={contract} />
      </section>
    </div>
  );
}
