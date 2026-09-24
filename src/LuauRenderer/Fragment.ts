import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";

export interface GeneratedRange {
	start: luau.Position;
	end: luau.Position;
	closing?: luau.Position;
}

export interface RenderedNodePosition {
	node: luau.Node;
	range: GeneratedRange;
}

interface SequenceFragment {
	kind: "sequence";
	parts: ReadonlyArray<RenderFragment>;
}

interface NodeFragment {
	kind: "node";
	node: luau.Node;
	content: RenderFragment;
}

interface ClosingFragment {
	kind: "closing";
	node: luau.Node;
}

/** whitespace which separates code, like indentation and line breaks, and is not part of any node's range */
interface LayoutFragment {
	kind: "layout";
	text: string;
}

/**
 * Rendered Luau code. Fragments other than strings are only created when positions are requested.
 */
export type RenderFragment = string | SequenceFragment | NodeFragment | ClosingFragment | LayoutFragment;

export function concat(...parts: Array<RenderFragment>): RenderFragment {
	return sequence(parts);
}

export function sequence(parts: ReadonlyArray<RenderFragment>): RenderFragment {
	let result = "";
	for (const part of parts) {
		if (typeof part !== "string") {
			return { kind: "sequence", parts };
		}
		result += part;
	}
	return result;
}

export function join(parts: ReadonlyArray<RenderFragment>, separator: string): RenderFragment {
	const result = new Array<RenderFragment>();
	for (let i = 0; i < parts.length; i++) {
		if (i > 0) {
			result.push(separator);
		}
		result.push(parts[i]);
	}
	return sequence(result);
}

export function markNode(node: luau.Node, content: RenderFragment): RenderFragment {
	return { kind: "node", node, content };
}

export function markClosing(node: luau.Node): RenderFragment {
	return { kind: "closing", node };
}

export function markLayout(text: string): RenderFragment {
	return { kind: "layout", text };
}

/** Returns the code of a fragment, ignoring any position markers. */
export function fragmentToString(fragment: RenderFragment): string {
	if (typeof fragment === "string") {
		return fragment;
	}
	return flattenFragment(fragment).code;
}

interface ActiveNode {
	node: luau.Node;
	result: RenderedNodePosition;
	hasContent: boolean;
}

type StackEntry = RenderFragment | { kind: "end"; active: ActiveNode };

/**
 * Returns the code of a fragment and the generated range of each node occurrence, in order of appearance.
 *
 * Lines and columns are zero-based, lines are separated by `\n`, and columns count UTF-16 code units.
 * A range starts at a node's first character and ends after its last character, excluding layout.
 */
export function flattenFragment(fragment: RenderFragment) {
	let code = "";
	const positions = new Array<RenderedNodePosition>();

	let line = 0;
	let column = 0;
	const advance = (text: string) => {
		for (let i = 0; i < text.length; i++) {
			// like the Luau lexer, only `\n` starts a new line
			if (text.charCodeAt(i) === 10) {
				line++;
				column = 0;
			} else {
				column++;
			}
		}
	};

	let contentEndLine = 0;
	let contentEndColumn = 0;
	const activeNodes = new Array<ActiveNode>();
	let firstActiveWithoutContent = 0;

	// iterative to support deeply nested and very long fragments
	const stack = new Array<StackEntry>(fragment);
	while (stack.length > 0) {
		const current = stack.pop()!;
		if (typeof current === "string") {
			if (current.length > 0) {
				for (let i = firstActiveWithoutContent; i < activeNodes.length; i++) {
					activeNodes[i].result.range.start = { line, column };
					activeNodes[i].hasContent = true;
				}
				firstActiveWithoutContent = activeNodes.length;
				code += current;
				advance(current);
				contentEndLine = line;
				contentEndColumn = column;
			}
		} else if (current.kind === "layout") {
			code += current.text;
			advance(current.text);
		} else if (current.kind === "sequence") {
			for (let i = current.parts.length - 1; i >= 0; i--) {
				stack.push(current.parts[i]);
			}
		} else if (current.kind === "node") {
			const result: RenderedNodePosition = {
				node: current.node,
				range: { start: { line, column }, end: { line, column } },
			};
			positions.push(result);
			const active: ActiveNode = { node: current.node, result, hasContent: false };
			activeNodes.push(active);
			stack.push({ kind: "end", active }, current.content);
		} else if (current.kind === "closing") {
			const active = activeNodes[activeNodes.length - 1];
			assert(active?.node === current.node, "Closing keyword must be rendered by its own node");
			active.result.range.closing = { line, column };
		} else {
			const { active } = current;
			// empty nodes keep an empty range at the position where they were rendered
			active.result.range.end = active.hasContent
				? { line: contentEndLine, column: contentEndColumn }
				: { ...active.result.range.start };
			activeNodes.pop();
			firstActiveWithoutContent = Math.min(firstActiveWithoutContent, activeNodes.length);
		}
	}

	return { code, positions };
}
