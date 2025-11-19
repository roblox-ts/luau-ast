import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderMixedTableType(state: RenderState, node: luau.TypeMixedTable) {
	const inner: Array<string> = [];
	for (const field of luau.list.toArray(node.fields)) {
		inner.push(render(state, field));
	}
	return `{ ${inner.join(", ")} }`;
}

export function renderMixedTableFieldType(state: RenderState, node: luau.TypeMixedTableField) {
	if (!luau.isValidIdentifier(node.index.name)) {
		return `["${node.index.name}"]: ${render(state, node.value)}`;
	}
	return `${render(state, node.index)}: ${render(state, node.value)}`;
}

export function renderMixedTableIndexedFieldType(state: RenderState, node: luau.TypeMixedTableIndexedField) {
	return `[${render(state, node.index)}]: ${render(state, node.value)}`;
}
