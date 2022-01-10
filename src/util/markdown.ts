import { marked } from "marked";

export default function markdown(input: string) {
  marked.setOptions({
    gfm: true,
  });

  return marked.parse(input);
}
