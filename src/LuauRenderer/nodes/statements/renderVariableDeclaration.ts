import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { concat, join, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderVariableDeclaration(state: RenderState, node: luau.VariableDeclaration) {
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

	if (node.right) {
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
		return state.fragmentLine(concat("local ", left, " = ", right), node);
	} else {
		return state.fragmentLine(concat("local ", left), node);
	}
}
