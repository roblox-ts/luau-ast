import { RenderState } from "LuauRenderer";

export function renderBreakStatement(state: RenderState) {
	return state.lineFragment(`break`);
}
