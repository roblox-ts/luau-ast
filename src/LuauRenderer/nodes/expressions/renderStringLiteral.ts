import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { getSafeBracketEquals } from "LuauRenderer/util/getSafeBracketEquals";
import { stripBackslashInEscapedNewLines } from "LuauRenderer/util/stripBackslashInEscapedNewLines";

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
	const isMultiline = node.value.includes("\n");
	if (!isMultiline && !node.value.includes('"')) {
		return `"${node.value}"`;
	} else if (!isMultiline && !node.value.includes("'")) {
		return `'${node.value}'`;
	} else {
		const eqStr = getSafeBracketEquals(node.value);
		const spacing = needsBracketSpacing(node) ? " " : "";
		const value = stripBackslashInEscapedNewLines(node.value);
		return `${spacing}[${eqStr}[${value}]${eqStr}]${spacing}`;
	}
}
