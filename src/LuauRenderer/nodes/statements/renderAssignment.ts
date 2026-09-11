import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { concat, join, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderAssignment(state: RenderState, node: luau.Assignment) {
	let left: RenderFragment;
	if (luau.list.isList(node.left)) {
		assert(!luau.list.isEmpty(node.left));
		left = join(
			luau.list.mapToArray(node.left, identifier => renderNode(state, identifier)),
			", ",
		);
	} else {
		left = renderNode(state, node.left);
	}

	let right: RenderFragment;
	if (luau.list.isList(node.right)) {
		assert(!luau.list.isEmpty(node.right));
		right = join(
			luau.list.mapToArray(node.right, expression => renderNode(state, expression)),
			", ",
		);
	} else {
		right = renderNode(state, node.right);
	}

	return state.fragmentLine(concat(left, ` ${node.operator} `, right), node);
}
