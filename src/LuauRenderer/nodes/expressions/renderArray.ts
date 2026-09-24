import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, join } from "LuauRenderer/Fragment";

export function renderArray(state: RenderState, node: luau.Array) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}

	const members = join(
		luau.list.mapToArray(node.members, member => renderNode(state, member)),
		", ",
	);
	return concat("{ ", members, " }");
}
