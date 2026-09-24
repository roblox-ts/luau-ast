import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, RenderFragment, sequence } from "LuauRenderer/Fragment";

export function renderMixedTable(state: RenderState, node: luau.MixedTable) {
	if (luau.list.isEmpty(node.fields)) {
		return "{}";
	}

	const result = new Array<RenderFragment>(state.newlineFragment("{"));
	state.block(() => {
		// temp fix for https://github.com/microsoft/TypeScript/issues/42932
		luau.list.forEach(node.fields, field =>
			result.push(state.lineFragment(concat(renderNode(state, field as luau.Node), ","))),
		);
	});
	result.push(state.indentedFragment("}"));
	return sequence(result);
}
