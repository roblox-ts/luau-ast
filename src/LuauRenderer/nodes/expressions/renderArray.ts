import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderArray(state: RenderState, node: luau.Array) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}
	const renderMembers = () => luau.list.mapToArray(node.members, member => render(state, member));
	const members = renderMembers();
	const arrayStr = `{ ${members.join(", ")} }`;
	// should format if a member is a non-empty function expression
	const skipFormatCheck = luau.list.some(
		node.members,
		member => luau.isFunctionExpression(member) && !luau.list.isEmpty(member.statements),
	);

	if (state.isFormattable(arrayStr, skipFormatCheck)) {
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
