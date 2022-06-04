import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";

export function renderVariableDeclaration(state: RenderState, node: luau.VariableDeclaration) {
	let leftStr: string;
	if (luau.list.isList(node.left)) {
		assert(!luau.list.isEmpty(node.left));
		leftStr = luau.list.mapToArray(node.left, id => render(state, id)).join(", ");
	} else {
		leftStr = render(state, node.left);
	}
	const rightNode = node.right;
	if (rightNode) {
		const formatStr = `local ${leftStr} = ${render(state, rightNode)}`;
		if (state.isFormattable(formatStr, rightNode.kind)) {
			let result = "";
			result += state.line(`local ${leftStr} =`);
			result += state.block(() => state.line(render(state, rightNode), node));
			return result;
		}
		return state.line(formatStr, node);
	} else {
		return state.line(`local ${leftStr}`, node);
	}
}
