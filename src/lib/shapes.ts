/** shapes the hero particles cycle through, in order */
export const SHAPES = ['identity', 'think', 'apps', 'video', 'write'] as const
export type ShapeKey = (typeof SHAPES)[number]
