import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, join, RenderFragment } from "LuauRenderer/Fragment";

export function renderAssignment(state: RenderState, node: luau.Assignment) {
	let left: RenderFragment;
	if (luau.list.isList(node.left)) {
		assert(!luau.list.isEmpty(node.left));
		left = join(
			luau.list.mapToArray(node.left, id => renderNode(state, id)),
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

	return state.lineFragment(concat(left, ` ${node.operator} `, right), node);
}
