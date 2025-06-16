import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";

export function renderTypeParameter(state: RenderState, node: luau.TypeParameter) {
	if (node.name) {
		assert(luau.isValidIdentifier(node.name), `Invalid Luau Identifier: "${node.name}"`);
		return `${node.name}: ${render(state, node.value)}`;
	}

	return render(state, node.value);
}
