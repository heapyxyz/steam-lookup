import { type } from "arktype"

export const Input = type("0 < string <= 64")
export type Input = typeof Input.infer
