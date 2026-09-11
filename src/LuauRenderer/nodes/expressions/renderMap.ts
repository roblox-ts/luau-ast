import luau from "LuauAST";
import { concat, RenderFragment, sequence } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderMap(state: RenderState, node: luau.Map) {
	if (luau.list.isEmpty(node.fields)) {
		return "{}";
	}

	const fields = new Array<RenderFragment>();
	state.block(() => {
		luau.list.forEach(node.fields, field => fields.push(state.fragmentLine(concat(renderNode(state, field), ","))));
		return "";
	});
	return sequence(["{\n", ...fields, state.fragmentIndented("}")]);
}
