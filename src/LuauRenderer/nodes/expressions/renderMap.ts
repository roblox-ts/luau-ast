import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, RenderFragment, sequence } from "LuauRenderer/Fragment";

export function renderMap(state: RenderState, node: luau.Map) {
	if (luau.list.isEmpty(node.fields)) {
		return "{}";
	}

	const result = new Array<RenderFragment>(state.newlineFragment("{"));
	state.block(() => {
		luau.list.forEach(node.fields, field => result.push(state.lineFragment(concat(renderNode(state, field), ","))));
	});
	result.push(state.indentedFragment("}"));
	return sequence(result);
}
