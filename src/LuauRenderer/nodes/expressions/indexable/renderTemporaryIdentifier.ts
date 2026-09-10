import luau from "LuauAST";
import { isNode } from "LuauAST/bundle";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";

export function renderTemporaryIdentifier(state: RenderState, node: luau.TemporaryIdentifier) {
	const name = state.getTempName(node);
	assert(luau.isValidIdentifier(name), `Invalid Temporary Identifier: "${name}"`);
	return name;
}

export function renderTemporaryIdentifierWithType(state: RenderState, node: luau.TemporaryIdentifier) {
	const name = state.getTempName(node);
	assert(luau.isValidIdentifier(name), `Invalid Temporary Identifier: "${name}"`);
	if (node.annotation && !isNode(node.annotation)) {
		return `${name}: ${render(state, node.annotation)}`;
	}
	return name;
}
