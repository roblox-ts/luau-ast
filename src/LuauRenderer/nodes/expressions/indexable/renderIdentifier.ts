import luau from "LuauAST";
import { isNone } from "LuauAST/bundle";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";

export function renderIdentifier(state: RenderState, node: luau.Identifier) {
	assert(luau.isValidIdentifier(node.name), `Invalid Luau Identifier: "${node.name}"`);
	return node.name;
}

export function renderIdentifierWithType(state: RenderState, node: luau.Identifier) {
	if (node.annotation && !isNone(node)) {
		return `${node.name}: ${render(state, node.annotation)}`;
	}
	return node.name;
}
