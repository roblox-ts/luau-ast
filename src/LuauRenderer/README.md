# roblox-ts LuauRenderer

This project takes a Luau AST (from LuauAST) and converts it into Luau source code in the form of a string.

## Structure

**render.ts** - routes each node to its `renderX()` function and exposes the string and generated-position rendering APIs

**RenderState.ts** - stores the current rendering state and the shared formatting operations

**Fragment.ts** - composes the renderer output and measures node ranges while flattening the emitted text once

**nodes/** - contains each node's layout function; layouts compose fragments that become strings at the public boundary

**util/** - various helper modules to aid in rendering
