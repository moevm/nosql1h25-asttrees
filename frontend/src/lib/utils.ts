import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface EntityField {
  id: string,
  name: string,
  type: 'int' | 'string' | 'boolean' | 'list' | 'date'
}
