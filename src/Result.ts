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
 * Result<T, E> is the type used for returning and propagating errors.
 * It is made of the variants, Ok(T), representing success and containing a value,
 * and Err(E), representing error and containing an error value.
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

  /**
   * Returns true if the result is Ok.
   */
  public isOk(): boolean {
    return this instanceof Ok;
  }

  /**
   * Returns true if the result is Err.
   */
  public isErr(): boolean {
    return this instanceof Err;
  }

  /**
   * Converts from Result<T, E> to Option<T>.
   */
  public ok(): Option<T> {
    if (this.isOk()) {
      return some<T>(this._success);
    }
    return none();
  }

  /**
   * Converts from Result<T, E> to Option<E>.
   */
  public err(): Option<E> {
    if (this.isOk()) {
      return none();
    }
    return some<E>(this._error);
  }

  /**
   * Returns res if the result is Ok, otherwise returns the Err value of self.
   */
  public and<U>(res: Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return res;
    }
    return new Err<E>(this._error);
  }

  /**
   * Calls op if the result is Ok, otherwise returns the Err value of self.
   */
  public andThen<U>(op: (success: T) => Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return op(this._success);
    }
    return new Err<E>(this._error);
  }

  /**
   * Unwraps a result, yielding the content of an Ok.
   */
  public expect(msg: string): T {
    if (this.isOk()) {
      return this._success;
    }
    throw new ResultError(msg);
  }

  /**
   * Unwraps a result, yielding the content of an Err.
   */
  public expectErr(msg: string): E {
    if (this.isErr()) {
      return this._error;
    }
    throw new ResultError(msg);
  }

  /**
   * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value,
   * leaving an Err value untouched.
   */
  public map<U>(op: (success: T) => U): Result<U, E> {
    if (this.isOk()) {
      return new Ok<U>(op(this._success));
    }
    return new Err<E>(this._error);
  }

  /**
   * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value,
   * leaving an Ok value untouched.
   */
  public mapErr<F>(op: (error: E) => F): Result<T, F> {
    if (this.isOk()) {
      return new Ok<T>(this._success);
    }
    return new Err<F>(op(this._error));
  }

  /**
   * Returns res if the result is Err, otherwise returns the Ok value of self.
   */
  public or<F>(res: Result<T, F>): Result<T, F> {
    if (this.isOk()) {
      return new Ok<T>(this._success);
    }
    return res;
  }

  /**
   * Calls op if the result is Err, otherwise returns the Ok value of self.
   */
  public orElse<F>(op: (error: E) => Result<T, F>): Result<T, F> {
    if (this.isOk()) {
      return new Ok<T>(this._success);
    }
    return op(this._error);
  }

  /**
   * Unwraps a result, yielding the content of an Ok.
   */
  public unwrap(): T {
    if (this.isOk()) {
      return this._success;
    }
    throw ResultError.illegalCall('unwrap', 'Err');
  }

  /**
   * Unwraps a result, yielding the content of an Err.
   */
  public unwrapErr(): E {
    if (this.isErr()) {
      return this._error;
    }
    throw ResultError.illegalCall('unwrapErr', 'Ok');
  }

  /**
   * Unwraps a result, yielding the content of an Ok. Else, it returns optb.
   */
  public unwrapOr(optb: T): T {
    if (this.isOk()) {
      return this._success;
    }
    return optb;
  }

  /**
   * Unwraps a result, yielding the content of an Ok.
   * If the value is an Err then it calls op with its value.
   */
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
