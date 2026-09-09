import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderMixedTable(state: RenderState, node: luau.MixedTable) {
	if (luau.list.isEmpty(node.fields)) {
		return "{}";
	}

	const fields = new Array<RenderFragment>();
	state.block(() => {
		// temp fix for https://github.com/microsoft/TypeScript/issues/42932
		luau.list.forEach(node.fields, field =>
			fields.push(state.fragmentLine(concat(renderNode(state, field as luau.Node), ","))),
		);
		return "";
	});
	return concat("{\n", ...fields, state.fragmentIndented("}"));
}
