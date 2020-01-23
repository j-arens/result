import { Ok, Err } from './Result';
export { Result } from './Result';

export function ok<T>(success: T): Ok<T> {
  return new Ok<T>(success);
}

export function err<E>(error: E): Err<E> {
  return new Err<E>(error);
}
