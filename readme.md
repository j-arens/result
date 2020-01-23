# Result

This is a partial port of the [Result](https://doc.rust-lang.org/std/result/) type from [Rust](https://www.rust-lang.org/). Most of the functionality is here but I skipped porting some of the more Rust-specific methods that don't really make sense in a Javascript context.

## Usage

Basic usage is the same as in Rust.

```ts
import { Result, ok, err } from '@j-arens/result';

// basic setting and getting of values
const greeting: Result<string, string> = ok('hey there');
const name = err('');

console.log(greeting.unwrap()); // logs 'hey there'
console.log(name.unwrap()); // throws an ResultError
console.log(name.unwrapOr('unknown')); // logs 'unknown'

// function that returns a Result<number, string>
function divide(x: number, y: number): Result<number, string> {
  if (y === 0) {
    return err('cannot divide by zero');
  }
  return ok(x / y);
}

divide(1, 0); // Err('cannot divide by zero')
divide(1, 1); // Ok(1)
```

## Testing

```
$ npm run test
```

## Linting

```
$ npm run lint
```

## Building

```
$ npm run build
```
