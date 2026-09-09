import luau from "LuauAST";
import { concat, RenderFragment, sequence } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderSet(state: RenderState, node: luau.Set) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}

	const members = new Array<RenderFragment>();
	state.block(() => {
		luau.list.forEach(node.members, member =>
			members.push(state.fragmentLine(concat("[", renderNode(state, member), "] = true,"))),
		);
		return "";
	});
	return sequence(["{\n", ...members, state.fragmentIndented("}")]);
}
