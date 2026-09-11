# @roblox-ts/luau-ast

`renderAST(ast)` renders a Luau syntax tree to source text. When a consumer also
needs generated locations, `renderASTWithPositions(ast)` returns the same code
and an ordered `positions` array with one entry for each emitted node occurrence.

Generated positions use zero-based lines and UTF-16 columns. Each range has an
inclusive `start` and exclusive `end`. Nodes that emit a closing keyword such as
`end` or `until` also report its start as `closing`.

```ts
import luau, { renderASTWithPositions, setNodeOrigin } from "@roblox-ts/luau-ast";

const statement = setNodeOrigin(luau.comment(" generated"), {
	start: { line: 2, column: 0 },
});
const { code, positions } = renderASTWithPositions(luau.list.make(statement));
```

`setNodeOrigin` attaches optional, source-language-neutral provenance to a node.
An origin has a `start` and may have a `closing` anchor. Generated nodes can omit
an origin. Origins survive the shallow clones performed by AST creation and list
helpers.
