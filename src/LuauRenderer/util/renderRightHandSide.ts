import luau, { render, RenderState } from "LuauAST";
import { isFormattable } from "LuauRenderer/util/isFormattable";

const NON_FORMATTABLE_RHS_EXPRESSIONS = new Set([
	luau.SyntaxKind.CallExpression,
	luau.SyntaxKind.MethodCallExpression,
	luau.SyntaxKind.Array,
	luau.SyntaxKind.Map,
	luau.SyntaxKind.Set,
	luau.SyntaxKind.MixedTable,
]);

/** Renders statements with left and right-hand side values and formats them if necessary. */
export function renderRightHandSide(state: RenderState, lhsStr: string, rhsExpr: luau.Expression) {
	const rhsStr = render(state, rhsExpr);
	const isRhsFormattable = isFormattable(rhsStr);
	const formatStr = `${lhsStr}${rhsStr}`;
	const renderRhs = () => state.indented(render(state, rhsExpr));
	if (isFormattable(formatStr) && isRhsFormattable && !NON_FORMATTABLE_RHS_EXPRESSIONS.has(rhsExpr.kind)) {
		return `${state.newline(lhsStr)}${
			isRhsFormattable ? state.block(() => state.block(renderRhs)) : state.block(renderRhs)
		}`;
	}
	return formatStr;
}
