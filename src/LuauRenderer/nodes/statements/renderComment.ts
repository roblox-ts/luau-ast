import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { concat, sequence } from "LuauRenderer/Fragment";
import { getSafeBracketEquals } from "LuauRenderer/util/getSafeBracketEquals";

export function renderComment(state: RenderState, node: luau.Comment) {
	const lines = node.text.split("\n");
	if (lines.length > 1) {
		const eqStr = getSafeBracketEquals(node.text);
		return concat(
			state.lineFragment(`--[${eqStr}[`),
			// indenting a blank line would only add trailing whitespace
			state.block(() =>
				sequence(
					lines.map(line => (line.trim() === "" ? state.newlineFragment("") : state.lineFragment(line))),
				),
			),
			state.lineFragment(`]${eqStr}]`),
		);
	} else {
		return sequence(lines.map(line => state.lineFragment(`--${line}`)));
	}
}
