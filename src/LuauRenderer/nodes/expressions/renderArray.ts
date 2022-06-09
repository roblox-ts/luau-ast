import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { isFormattable } from "LuauRenderer/util/isFormattable";

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

	if (skipFormatCheck || isFormattable(arrayStr)) {
		return `${state.newline("{")}${state.list(renderMembers)}${state.indented("}")}`;
	}

	return arrayStr;
}
