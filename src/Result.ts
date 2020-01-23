import { Option, some, none } from '@j-arens/option';

/**
 * ResultError
 */
export class ResultError extends Error {
  public name = 'ResultError';

  public static illegalInstantiation(): ResultError {
    return new ResultError('Result must be an instance of Ok or Err');
  }

  public static illegalCall(method: string, type: 'Ok' | 'Err'): ResultError {
    return new ResultError(`cannot call ${method} on a Result of type ${type}`);
  }
}

/**
 * Base Result (should not instantiated directly use Ok or Some instead).
 */
export class Result<T, E> {
  private _success: T;

  private _error: E;

  public constructor(success: T, error: E) {
    if (!this.isOk() && !this.isErr()) {
      throw ResultError.illegalInstantiation();
    }
    this._success = success;
    this._error = error;
  }

  public isOk(): boolean {
    return this instanceof Ok;
  }

  public isErr(): boolean {
    return this instanceof Err;
  }

  public ok(): Option<T> {
    if (this.isOk()) {
      return some<T>(this._success);
    }
    return none();
  }

  public err(): Option<E> {
    if (this.isOk()) {
      return none();
    }
    return some<E>(this._error);
  }

  public and<U>(res: Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return res;
    }
    return new Err<E>(this._error);
  }

  public andThen<U>(op: (success: T) => Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return op(this._success);
    }
    return new Err<E>(this._error);
  }

  public expect(msg: string): T {
    if (this.isOk()) {
      return this._success;
    }
    throw new ResultError(msg);
  }

  public expectErr(msg: string): E {
    if (this.isErr()) {
      return this._error;
    }
    throw new ResultError(msg);
  }

  public map<U>(op: (success: T) => U): Result<U, E> {
    if (this.isOk()) {
      return new Ok<U>(op(this._success));
    }
    return new Err<E>(this._error);
  }

  public mapErr<F>(op: (error: E) => F): Result<T, F> {
    if (this.isOk()) {
      return new Ok<T>(this._success);
    }
    return new Err<F>(op(this._error));
  }

  public or<F>(res: Result<T, F>): Result<T, F> {
    if (this.isOk()) {
      return new Ok<T>(this._success);
    }
    return res;
  }

  public orElse<F>(op: (error: E) => Result<T, F>): Result<T, F> {
    if (this.isOk()) {
      return new Ok<T>(this._success);
    }
    return op(this._error);
  }

  public unwrap(): T {
    if (this.isOk()) {
      return this._success;
    }
    throw ResultError.illegalCall('unwrap', 'Err');
  }

  public unwrapErr(): E {
    if (this.isErr()) {
      return this._error;
    }
    throw ResultError.illegalCall('unwrapErr', 'Ok');
  }

  public unwrapOr(optb: T): T {
    if (this.isOk()) {
      return this._success;
    }
    return optb;
  }

  public unwrapOrElse(op: (error: E) => T): T {
    if (this.isOk()) {
      return this._success;
    }
    return op(this._error);
  }
}

/**
 * The Ok variant of Result, contains a success value.
 */
export class Ok<T> extends Result<T, never> {
  public constructor(success: T) {
    super(success, undefined as never);
  }
};

/**
 * The Err variant of Result, contains an error value.
 */
export class Err<E> extends Result<never, E> {
  public constructor(error: E) {
    super(undefined as never, error);
  }
};
