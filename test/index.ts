import 'mocha';
import { Some, None } from '@j-arens/option/Option';
import assert = require('assert');
import { Result, Ok, Err } from '../src/Result';

describe('creating an instance of Result', () => {
  it('throws if instantiated directly', () => {
    const fn = () => {
      new Result(1, 0);
    };
    assert.throws(fn, {
      name: 'ResultError',
      message: 'Result must be an instance of Ok or Err',
    });
  });
});

describe('isOk', () => {
  it('should return true for instances of Ok', () => {
    assert(new Ok('').isOk());
  });

  it('should return false for instances of Err', () => {
    assert(!new Err('').isOk());
  });
});

describe('isErr', () => {
  it('should return true for instances of Err', () => {
    assert(new Err('').isErr());
  });

  it('should return false for instance of Ok', () => {
    assert(!new Ok('').isErr());
  });
});

describe('ok', () => {
  it('returns a Some containing the success value if called on an instance of Ok', () => {
    const opt = new Ok('foo').ok();
    assert(opt instanceof Some);
    assert.strictEqual(opt.unwrap(), 'foo');
  });

  it('returns a None if called on an instance of Err', () => {
    assert(new Err('').ok() instanceof None);
  });
});

describe('err', () => {
  it('returns a Some containg the error value if called on an instance of Err', () => {
    const opt = new Err('foo').err();
    assert(opt instanceof Some);
    assert.strictEqual(opt.unwrap(), 'foo');
  });

  it('returns a None if called on an instance of Ok', () => {
    assert(new Ok('').err() instanceof None);
  });
});

describe('and', () => {
  it('returns the given result if called on an instance of Ok', () => {
    const resa = new Ok('foo');
    const resb = new Ok('bar');
    assert.strictEqual(resa.and(resb), resb);
  });

  it('returns a new instance of Err if called on an instance of Err', () => {
    const resa = new Err('foo');
    const resb = new Ok('bar');
    const resc = resa.and(resb);
    assert(resc.isErr());
    assert.notStrictEqual(resa, resc);
  });
});

describe('andThen', () => {
  it('returns the result returned from the given function if called on an instance of Ok', () => {
    const resa: Result<string, string> = new Ok('foo');
    const appendBar = (word: string): Result<string, string> => new Ok(`${word}bar`);
    const resb = resa.andThen(appendBar);
    assert(resb.isOk());
    assert.strictEqual(resb.unwrap(), 'foobar');
  });

  it('returns a new instance of Err if called on an instance of Err', () => {
    const resa: Result<string, string> = new Err('');
    const resb = resa.andThen(x => new Ok(x));
    assert(resb.isErr());
    assert.notStrictEqual(resa, resb);
  });
});

describe('expect', () => {
  it('returns the success value if called on an instance of Ok', () => {
    assert.strictEqual(new Ok('foo').expect(''), 'foo');
  });

  it('throws a ResultError with the given message if called on an instance of Err', () => {
    const fn = () => {
      new Err('').expect('oops');
    };
    assert.throws(fn, {
      name: 'ResultError',
      message: 'oops',
    });
  });
});

describe('expectErr', () => {
  it('returns the error value if called on an instance of Err', () => {
    assert.strictEqual(new Err('foo').expectErr(''), 'foo');
  });

  it('throws a ResultError with the given message if called on an instance of Ok', () => {
    const fn = () => {
      new Ok('').expectErr('oops');
    };
    assert.throws(fn, {
      name: 'ResultError',
      message: 'oops',
    });
  });
});

describe('map', () => {
  it('returns a new instance of Ok if called on an instance of Ok', () => {
    const resa = new Ok('foo');
    const resb = resa.map(x => x);
    assert(resb.isOk());
    assert.notStrictEqual(resa, resb);
  });

  it('returns an instance of Ok containg the product of the given function', () => {
    const res = new Ok('foo').map(x => `${x}bar`);
    assert.strictEqual(res.unwrap(), 'foobar');
  });

  it('returns a new instance of Err with the error value if called on an instance of Err', () => {
    const resa = new Err('');
    const resb = resa.map(x => x);
    assert(resb.isErr());
    assert.notStrictEqual(resa, resb);
  });
});

describe('mapErr', () => {
  it('returns a new instance of Err if called on an instance of Err', () => {
    const resa = new Err('foo');
    const resb = resa.mapErr(x => x);
    assert(resb.isErr());
    assert.notStrictEqual(resa, resb);
  });

  it('returns an instance of Err containg the product of the given function', () => {
    const res = new Err('foo').mapErr(x => `${x}bar`);
    assert.strictEqual(res.unwrapErr(), 'foobar');
  });

  it('returns a new instance of Ok with the success value if called on an instance of Ok', () => {
    const resa = new Ok('');
    const resb = resa.map(x => x);
    assert(resb.isOk());
    assert.notStrictEqual(resa, resb);
  });
});

describe('or', () => {
  it('returns a new instance of Ok with the success value if called on an instance of Ok', () => {
    const resa = new Ok('foo');
    const resb = new Ok('bar');
    const resc = resa.or(resb);
    assert(resc.isOk());
    assert.strictEqual(resc.unwrap(), 'foo');
  });

  it('returns the given result of called on an instance of Err', () => {
    const resa: Result<string, string> = new Err('foo');
    const resb = new Ok('bar');
    const resc = resa.or(resb);
    assert.strictEqual(resb, resc);
  });
});

describe('orElse', () => {
  it('returns a new instance of Ok with the success value if called on an instance of Ok', () => {
    const resa = new Ok('foo');
    const resb = new Ok('bar');
    const resc = resa.orElse(() => resb);
    assert(resc.isOk());
    assert.strictEqual(resc.unwrap(), 'foo');
  });

  it('returns the result returned by the given function if called on an instance of none', () => {
    const resa: Result<string, string> = new Err('foo');
    const resb = new Ok('bar');
    const resc = resa.orElse(() => resb);
    assert.strictEqual(resb, resc);
  });
});

describe('unwrap', () => {
  it('returns the success value contained within an Ok', () => {
    assert.strictEqual(new Ok('foo').unwrap(), 'foo');
  });

  it('throws if called on an instance of Err', () => {
    const fn = () => {
      new Err('foo').unwrap();
    };
    assert.throws(fn, {
      name: 'ResultError',
      message: 'cannot call unwrap on a Result of type Err',
    });
  });
});

describe('unwrapErr', () => {
  it('returns the error value contained within an Err', () => {
    assert.strictEqual(new Err('foo').unwrapErr(), 'foo');
  });

  it('throws if called on an instance of Ok', () => {
    const fn = () => {
      new Ok('foo').unwrapErr();
    };
    assert.throws(fn, {
      name: 'ResultError',
      message: 'cannot call unwrapErr on a Result of type Ok',
    });
  });
});

describe('unwrapOr', () => {
  it('returns the success value contained within if called on an instance of Ok', () => {
    assert.strictEqual(new Ok('foo').unwrapOr(''), 'foo');
  });

  it('returns the given value if called on an instance of Err', () => {
    const res: Result<string, string> = new Err('');
    assert.strictEqual(res.unwrapOr('foo'), 'foo');
  });
});

describe('unwrapOrElse', () => {
  it('returns the success value contained within if called on an instance of Ok', () => {
    assert.strictEqual(new Ok('foo').unwrapOrElse(() => ''), 'foo');
  });

  it('returns the product returned from the given function if called on an instance of Err', () => {
    const res: Result<string, string> = new Err('');
    assert.strictEqual(res.unwrapOrElse(() => 'foo'), 'foo');
  });
});
