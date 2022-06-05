import luau, { render, RenderState } from "LuauAST";

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
	const rightStr = render(state, rhsExpr);
	const formatStr = `${lhsStr}${rightStr}`;
	if (
		state.isFormattable(formatStr) &&
		state.isFormattable(rightStr) &&
		!NON_FORMATTABLE_RHS_EXPRESSIONS.has(rhsExpr.kind)
	) {
		return `${state.newline(lhsStr)}${state.block(() => state.indented(render(state, rhsExpr)))}`;
	}
	return formatStr;
}
