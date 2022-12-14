import type { CodecClass, Registry } from '../types';
/**
 * @description takes an input map of the form `{ [string]: string | CodecClass }` and returns a map of `{ [string]: CodecClass }`
 */
export declare function mapToTypeMap(registry: Registry, input: Record<string, string | CodecClass>): [CodecClass[], string[]];
