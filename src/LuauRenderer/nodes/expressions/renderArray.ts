import luau from "LuauAST";
import { concat, join } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderArray(state: RenderState, node: luau.Array) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}

	const members = luau.list.mapToArray(node.members, member => renderNode(state, member));
	return concat("{ ", join(members, ", "), " }");
}
