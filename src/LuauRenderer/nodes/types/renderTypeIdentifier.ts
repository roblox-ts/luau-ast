import assert from "assert";
import luau from "LuauAST";
import { RenderState } from "LuauRenderer";

export function renderTypeIdentifier(state: RenderState, node: luau.TypeIdentifier) {
	assert(luau.isValidIdentifier(node.name), `Invalid Luau Identifier: "${node.name}"`);
	if (node.module) return `${node.module}.${node.name}`;
	return node.name;
}
