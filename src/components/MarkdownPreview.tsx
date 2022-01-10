import markdown from "~/util/markdown";

export default function MarkdownPreview(props) {
  return (
    <div className="h-full w-full p-6 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 flex justify-center break-words">
      <div
        className="prose min-w-[65ch]"
        dangerouslySetInnerHTML={{ __html: markdown(props.input) }}
      />
    </div>
  );
}
