import luau from "LuauAST";
import { RenderState } from "LuauRenderer";

export function renderInterpolatedStringPart(state: RenderState, node: luau.InterpolatedStringPart) {
	// braces and newlines are escaped to be valid in luau
	// () captures result, [] to search for any of: {}
	// $1 fills in capture from original search
	return node.text.replace(/([{}])/g, "\\$1").replace(/(\r\n?|\n)/g, "\\$1");
}
