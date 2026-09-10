import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { getSafeBracketEquals } from "LuauRenderer/util/getSafeBracketEquals";

// separates long-bracket string delimiters from surrounding indexing brackets to avoid ambiguous syntax
function needsBracketSpacing(node: luau.StringLiteral) {
	const parent = node.parent;
	if (!parent) {
		return false;
	}

	// [ [[a]] ] = b
	if (luau.isMapField(parent) && node === parent.index) {
		return true;
	}

	// a[ [[b]] ]
	if (luau.isComputedIndexExpression(parent) && node === parent.index) {
		return true;
	}

	// { [ [[a]] ] = true }
	if (luau.isSet(parent)) {
		return true;
	}

	return false;
}

export function renderStringLiteral(state: RenderState, node: luau.StringLiteral) {
	if (node.quote !== undefined) {
		return `${node.quote}${node.value}${node.quote}`;
	}

	const isMultiline = node.value.includes("\n");
	if (!isMultiline && !node.value.includes('"')) {
		return `"${node.value}"`;
	} else if (!isMultiline && !node.value.includes("'")) {
		return `'${node.value}'`;
	} else {
		const eqStr = getSafeBracketEquals(node.value);
		const spacing = needsBracketSpacing(node) ? " " : "";
		return `${spacing}[${eqStr}[${node.value}]${eqStr}]${spacing}`;
	}
}
