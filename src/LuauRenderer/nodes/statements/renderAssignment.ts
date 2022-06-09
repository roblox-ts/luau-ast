import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";
import { renderRightHandSide } from "LuauRenderer/util/renderRightHandSide";

export function renderAssignment(state: RenderState, node: luau.Assignment) {
	let leftStr: string;
	if (luau.list.isList(node.left)) {
		assert(!luau.list.isEmpty(node.left));
		leftStr = luau.list.mapToArray(node.left, id => render(state, id)).join(", ");
	} else {
		leftStr = render(state, node.left);
	}
	return state.line(renderRightHandSide(state, `${leftStr} ${node.operator} `, node.right), node);
}
