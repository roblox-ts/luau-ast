import luau from "LuauAST";
import { RenderState } from "LuauRenderer";

export function renderInterpolatedStringPart(state: RenderState, node: luau.InterpolatedStringPart) {
	// braces and newlines are escaped to be valid in luau
	// () captures result, [] to search for any of: {}
	// $1 fills in capture from original search
	// \u{.+?} is a unicode escape sequence which should not be escaped
	// (?<!\\u(?:{.+?)?) is a negative lookbehind for either the starting or ending brace of such a sequence
	// to ensure the unicode escape sequence is exempt from escaping
	return node.text.replace(/(?<!\\u(?:{.+?)?)([{}])/g, "\\$1").replace(/\n/g, "\\\n");
}
