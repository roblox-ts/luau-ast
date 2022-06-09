import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";
import { renderRightHandSide } from "LuauRenderer/util/renderRightHandSide";

export function renderVariableDeclaration(state: RenderState, node: luau.VariableDeclaration) {
	let leftStr: string;
	if (luau.list.isList(node.left)) {
		assert(!luau.list.isEmpty(node.left));
		leftStr = luau.list.mapToArray(node.left, id => render(state, id)).join(", ");
	} else {
		leftStr = render(state, node.left);
	}
	if (node.right) {
		return state.line(renderRightHandSide(state, `local ${leftStr} = `, node.right), node);
	} else {
		return state.line(`local ${leftStr}`, node);
	}
}
