import { makeTreeSitterAdapter, typescript } from "@danilocampos/coherence/dist/adapters/tree-sitter.js";

const grammar = new URL(
  "../../node_modules/@danilocampos/coherence/grammars/tree-sitter-typescript.wasm",
  import.meta.url,
).pathname;

export default await makeTreeSitterAdapter({ ...typescript, exts: ["js", "jsx", "mjs"] }, grammar);
