import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

function formatArray(state: RenderState, renderMembers: () => ReadonlyArray<string>, hasFunctionExpression: boolean) {
	const members = renderMembers();
	const arrayStr = `{ ${members.join(", ")} }`;

	if (state.isFormattable(arrayStr, undefined, hasFunctionExpression)) {
		let result = "{\n";
		state.block(() => {
			renderMembers().forEach(
				(member, i) => (result += state.line(`${member}${i < members.length - 1 ? "," : ""}`)),
			);
		});
		result += state.indented("}");
		return result;
	}

	return arrayStr;
}

export function renderArray(state: RenderState, node: luau.Array) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}
	return formatArray(
		state,
		() => luau.list.mapToArray(node.members, member => render(state, member)),
		luau.list.some(
			node.members,
			member => luau.isFunctionExpression(member) && !luau.list.isEmpty(member.statements),
		),
	);
}
