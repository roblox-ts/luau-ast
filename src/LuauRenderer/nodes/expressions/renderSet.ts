import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, RenderFragment, sequence } from "LuauRenderer/Fragment";

export function renderSet(state: RenderState, node: luau.Set) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}

	const result = new Array<RenderFragment>(state.newlineFragment("{"));
	state.block(() => {
		luau.list.forEach(node.members, member => {
			if (luau.isStringLiteral(member) && luau.isValidIdentifier(member.value)) {
				result.push(state.lineFragment(concat(state.markNode(member, member.value), " = true,")));
			} else {
				result.push(state.lineFragment(concat("[", renderNode(state, member), "] = true,")));
			}
		});
	});
	result.push(state.indentedFragment("}"));
	return sequence(result);
}
