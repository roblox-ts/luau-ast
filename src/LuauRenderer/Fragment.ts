import luau from "LuauAST";

export interface GeneratedPosition {
	line: number;
	column: number;
}

export interface GeneratedRange {
	start: GeneratedPosition;
	end: GeneratedPosition;
	closing?: GeneratedPosition;
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

export type RenderFragment = string | SequenceFragment | NodeFragment | ClosingFragment;

export function concat(...parts: ReadonlyArray<RenderFragment>): RenderFragment {
	let result = "";
	for (const part of parts) {
		if (typeof part !== "string") {
			return { kind: "sequence", parts };
		}
		result += part;
	}
	return result;
}

export function sequence(parts: ReadonlyArray<RenderFragment>): RenderFragment {
	if (parts.every(part => typeof part === "string")) {
		return (parts as ReadonlyArray<string>).join("");
	}
	return { kind: "sequence", parts };
}

export function join(parts: ReadonlyArray<RenderFragment>, separator: string): RenderFragment {
	if (parts.every(part => typeof part === "string")) {
		return (parts as ReadonlyArray<string>).join(separator);
	}
	const result = new Array<RenderFragment>();
	for (let index = 0; index < parts.length; index++) {
		if (index > 0) {
			result.push(separator);
		}
		result.push(parts[index]);
	}
	return sequence(result);
}

export function markNode(node: luau.Node, content: RenderFragment): RenderFragment {
	return { kind: "node", node, content };
}

export function markClosing(node: luau.Node): RenderFragment {
	return { kind: "closing", node };
}

function copyPosition(position: GeneratedPosition): GeneratedPosition {
	return { line: position.line, column: position.column };
}

function advance(position: GeneratedPosition & { previousWasCarriageReturn: boolean }, text: string) {
	for (let index = 0; index < text.length; index++) {
		const character = text.charCodeAt(index);
		if (character === 13) {
			position.line++;
			position.column = 0;
			position.previousWasCarriageReturn = true;
		} else if (character === 10) {
			if (!position.previousWasCarriageReturn) {
				position.line++;
			}
			position.column = 0;
			position.previousWasCarriageReturn = false;
		} else {
			position.column++;
			position.previousWasCarriageReturn = false;
		}
	}
}

export function flattenFragment(fragment: RenderFragment, includePositions = false) {
	if (typeof fragment === "string") {
		return { code: fragment, positions: new Array<RenderedNodePosition>() };
	}
	let code = "";
	const position = { line: 0, column: 0, previousWasCarriageReturn: false };
	const positions = new Array<RenderedNodePosition>();
	const activeNodes = new Array<{ node: luau.Node; closing?: GeneratedPosition }>();
	type StackEntry = RenderFragment | { kind: "end-node"; active: (typeof activeNodes)[number]; resultIndex: number };
	const stack = new Array<StackEntry>(fragment);

	while (stack.length > 0) {
		const current = stack.pop()!;
		if (typeof current === "string") {
			code += current;
			if (includePositions) {
				advance(position, current);
			}
			continue;
		}
		if (current.kind === "sequence") {
			for (let index = current.parts.length - 1; index >= 0; index--) {
				stack.push(current.parts[index]);
			}
			continue;
		}
		if (current.kind === "closing") {
			if (includePositions) {
				for (let index = activeNodes.length - 1; index >= 0; index--) {
					const active = activeNodes[index];
					if (active.node === current.node) {
						active.closing = copyPosition(position);
						break;
					}
				}
			}
			continue;
		}
		if (current.kind === "end-node") {
			const result = positions[current.resultIndex];
			result.range.end = copyPosition(position);
			if (current.active.closing) {
				result.range.closing = current.active.closing;
			}
			activeNodes.pop();
			continue;
		}
		if (!includePositions) {
			stack.push(current.content);
			continue;
		}

		const active: { node: luau.Node; closing?: GeneratedPosition } = { node: current.node };
		activeNodes.push(active);
		const resultIndex =
			positions.push({
				node: current.node,
				range: {
					start: copyPosition(position),
					end: copyPosition(position),
				},
			}) - 1;
		stack.push({ kind: "end-node", active, resultIndex }, current.content);
	}
	return { code, positions };
}
