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
	return { kind: "sequence", parts };
}

export function join(parts: ReadonlyArray<RenderFragment>, separator: string): RenderFragment {
	const result = new Array<RenderFragment>();
	for (let index = 0; index < parts.length; index++) {
		if (index > 0) {
			result.push(separator);
		}
		result.push(parts[index]);
	}
	return concat(...result);
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
	let code = "";
	const position = { line: 0, column: 0, previousWasCarriageReturn: false };
	const positions = new Array<RenderedNodePosition>();
	const activeNodes = new Array<{ node: luau.Node; closing?: GeneratedPosition }>();

	const write = (current: RenderFragment): void => {
		if (typeof current === "string") {
			code += current;
			if (includePositions) {
				advance(position, current);
			}
			return;
		}
		if (current.kind === "sequence") {
			for (const part of current.parts) {
				write(part);
			}
			return;
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
			return;
		}

		const start = copyPosition(position);
		const active: { node: luau.Node; closing?: GeneratedPosition } = { node: current.node };
		activeNodes.push(active);
		write(current.content);
		if (includePositions) {
			positions.push({
				node: current.node,
				range: {
					start,
					end: copyPosition(position),
					...(active.closing ? { closing: active.closing } : {}),
				},
			});
		}
		activeNodes.pop();
	};

	write(fragment);
	return { code, positions };
}
