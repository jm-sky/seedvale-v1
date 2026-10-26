export const BODY_MORPH: string
export const BODY: Record<'Male' | 'Female', { pelvisY: number; neckY: number }>
export function warpBody(sex: 'Male' | 'Female', p: number[]): number[]
