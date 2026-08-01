---
title: "Deep-flatten TypeScript type"
date: "2024-01-07"
description: "A deep dive into building a recursive FlattenObject TypeScript type that flattens arbitrarily nested object types into dot-notation keys."
canonical: "https://medium.com/swmansion/deep-flatten-typescript-type-c0d123028d82"
---

![Deep Flatten types in typescript](/images/posts/deep-flatten-typescript-type-1.png)

*“How deep does the rabbit hole go?” 💊* a famous line from the Matrix movie often comes to my mind when dealing with complex recursive types in TypeScript.

Nested object types can be a real pain to work with, especially when recursion comes into play. What if I told you that you could flatten an object with nested properties? Not just flatten, but transform it from {a: { b: { c: string }}} to { 'a.b.c': string } format.

But beware of the rabbit hole, you might find it deeper than you think. Ready to jump in?

## The goal

Suppose we have a complex and arbitrarily nested TypeScript type called Foo:

```typescript
type Foo = {
  array: { timestamp: Date }[];
  nested: { optionalStr?: string; unknown: unknown };
  set: Set<string>;
};
```

The goal is to preserve the types, but flatten the objects such that the properties are now on the root level:

```tsx
type FlattenedFoo = FlattenObject<Foo>;
{
  array: Array<{ timestamp: Date }>;
  [x: `array[${bigint}]`]: { timestamp: Date };
  [x: `array[${bigint}].timestamp`]: Date;

  nested: { optionalStr?: string; unknown: unknown };
  'nested.optionalStr': string | undefined;
  'nested.unknown': unknown;

  set: Set<string>;
};
```

## Motivation

You might be wondering why anyone would need such a complicated type? Some time ago I stumbled on problem while developing Typescript modeling tool for DynamoDB — [dynamode](https://github.com/blazejkustra/dynamode).

![Dynamode motto, a better way of using DynamoDB in typescript](/images/posts/deep-flatten-typescript-type-2.png)

If you’ve ever worked with DynamoDB, a NoSQL database service from Amazon, you’ll likely be aware that the data is stored in a nested JSON-like format. While the database is quite efficient it becomes problematic when you want to query or update nested fields, there is no type safety and auto-completion out of the box.

That’s precisely the point at which FlattenObject came into action. It served the dual purpose of bringing type safety and auto-completion to the table, simply by flattening the defined model.

![](/images/posts/deep-flatten-typescript-type-3.png)

*Autocomplete and type safety 🧙‍♂️*

**For more details read this** [**article**](https://blog.swmansion.com/modeling-with-dynamodb-made-easy-in-typescript-cdada092d387) **about Dynamode / Leave a star on** [**Github**](https://github.com/blazejkustra/dynamode) **⭐️**

## Understand FlattenObject

How about we tackle each part of this type and understand it piece by piece? Let’s dissect the FlattenObject:

```tsx
type FlattenObject<TValue> = CollapseEntries<CreateObjectEntries<TValue, TValue>>;
```

The FlattenObject is designed as a composition of CreateObjectEntries, responsible for exploding an object into its entry elements and CreateObjectEntries tasked with collapsing these entries back into a flat object.

### CreateObjectEntries<TValue, TValueInitial>

CreateObjectEntries creates a union of entries that look like this:

```typescript
type Entry = { key: string; value: unknown };
```

For a hypothetical type {a: string, b?: number} you’ll get {key: "a", value: string} | {key: "b", value: number | undefined} as an exploded outcome.

```tsx
type EmptyEntry<TValue> = { key: ''; value: TValue };

type CreateObjectEntries<TValue, TValueInitial> = TValue extends object
  ? {
      // Checks that Key is of type string
      [TKey in keyof TValue]-?: TKey extends string
        ? // Nested key can be an object, run recursively to the bottom
          CreateArrayEntry<TValue[TKey], TValueInitial> extends infer TNestedValue
          ? TNestedValue extends Entry
            ? TNestedValue['key'] extends ''
              ? {
                  key: TKey;
                  value: TNestedValue['value'];
                }
              :
                  | {
                      key: `${TKey}.${TNestedValue['key']}`;
                      value: TNestedValue['value'];
                    }
                  | {
                      key: TKey;
                      value: TValue[TKey];
                    }
            : never
          : never
        : never;
    }[keyof TValue] // Builds entry for each key
  : EmptyEntry<TValue>;
```

It’s a recursive type with a base condition TValue extends object ? … : EmptyEntry<TValue> that checks if TValue is an object. Each object property then calls CreateArrayEntry<TValue[TKey], TValueInitial> in order to handle exceptions.

The rest is simple, just keep building the union of entries, both for nested keys ${TKey}.${TNestedValue[‘key’]} and the TKey itself:

```typescript
TNestedValue['key'] extends ''
? {
    key: TKey;
    value: TNestedValue['value'];
  }
:
  | {
      key: `${TKey}.${TNestedValue['key']}`;
      value: TNestedValue['value'];
    }
  | {
      key: TKey;
      value: TValue[TKey];
    }
: never
```

## Tackle the Exceptions

### CreateArrayEntry<TValue, TValueInitial>

When the value is an array we need to transform it to an artificial object with key encoded as `[${bigint}]`. For a type string[] you’ll get { [k: `[${bigint}]`]: string } as an outcome.

```tsx
type ArrayEncoder = `[${bigint}]`;

// Transforms array type to object
type CreateArrayEntry<TValue, TValueInitial> = OmitItself<
  TValue extends unknown[] ? { [k: ArrayEncoder]: TValue[number] } : TValue,
  TValueInitial
>;
```

### OmitItself<TValue, TValueInitial>

What if our type references itself? We want to avoid flattening infinitely 😅 For a type type Foo = { nestedFoo: Foo }you’ll get { key: “nestedFoo”; value: Foo; } as an outcome, otherwise call OmitExcludedTypes. That’s why all types have the TValueInitial parameter, to keep track of the initial type.

```tsx
// Omit the type that references itself
type OmitItself<TValue, TValueInitial> = TValue extends TValueInitial
  ? EmptyEntry<TValue>
  : OmitExcludedTypes<TValue, TValueInitial>;
```

### OmitExcludedTypes<TValue, TValueInitial>

There are some types that we don’t want to flatten, instead we just return an empty entry { key: ''; value: Date | Set | Map } otherwise call CreateObjectEntries back.

```tsx
type ExcludedTypes = Date | Set<unknown> | Map<unknown, unknown>;

// Omit the type that is listed in ExcludedTypes union
type OmitExcludedTypes<TValue, TValueInitial> = TValue extends ExcludedTypes
  ? EmptyEntry<TValue>
  : CreateObjectEntries<TValue, TValueInitial>;
```

### CollapseEntries<TEntry>

The last part is to collapse entries and build back the initial object. This is also quite straight forward, iterate on every entry and transform it to key value format.

```tsx
type CollapseEntries<TEntry extends Entry> = {
  [E in TEntry as EscapeArrayKey<E['key']>]: E['value'];
};
```

### EscapeArrayKey<TKey>

In my particular case I needed to get rid of dots in front of every array, otherwise just return the key.

```tsx
type EscapeArrayKey<TKey extends string> = TKey extends `${infer TKeyBefore}.${ArrayEncoder}${infer TKeyAfter}`
  ? EscapeArrayKey<`${TKeyBefore}${ArrayEncoder}${TKeyAfter}`>
  : TKey;
```

## It works! 🥁

**You can find the source code** [**here**](https://github.com/blazejkustra/dynamode/blob/fd3abf1e420612811c3eba96ec431e00c28b2783/lib/utils/types.ts#L10)**, or explore it on** [**Typescript Playground**](https://www.typescriptlang.org/play?#code/PTAEDEBsEMBdYKYDtTNgS1gTwFDYA4IQzzIDyARgFYIDGsAPACoBq0kArggHygC8oAMIB7SDHwBnBAFEksAE7oEEhoPkI4CSjXqyFSla3ZcANKCOce3ANw48WQqD3ys-UAG9QAawRYAXKAS+kgA5tagAG7GCAEcSF5IwgDuKAC+tgRE0gC2+NjOWMxslrwCnj7+oADkVeFRlgEWXKDp9o7SAB60nAAmCD1MDspuACKaoAA+oADKCIxxCclIvFMAstD4DAuJKWbbSzZtRACC8vLQWLK0wn3ybgAGANoAJO4U6CHocqkAuve2RycEloGwQp3OWAA0r5mNDXAgOogkD0JIFgiFSuY4ahEcgUaB7q8vgAzBB3JhwgBCCGJwnUqQAdK9wRcrjcyakiUhSeS4cdiYh5Kl7jhQKAAPxAkGEFlQmGE9wU3zU2n05lnVlIa63TmKvkCjn3bii0CNOEAkDmc5ICSq7KotCKYawYSgYRIIjEkhI-qgTKAkRiDZSZwGZgFHFI-EFTHuE2PaSgL7mCPQVHSYGg2VwhjSR5VCpVH7cH4BPNVepcIu2Vo4S1Ma22un20DQDWuTJ+13Cah0WAB9SaWUFIrRMxNBAASSQmHQ7ExZGymEnsCkkGJDBNE8jeNR+xSjx+Eo8oEeXgCw617PkpfMxS4jyQHGyFDJR9SprvY6396nM4w7A4IcdZgIumB+gAFkQnawBBcCgOoPLILQwyYGuxKAmBsAruho6WOOv7TrO85uNuCJRqiE5EQBkAmpKOR5JccguHhXDGmKARYZ03QcH0AxDIYv4EdE1FzpAwGWlhkHQUMkHwegqKQApiA9EmKDcb0-SDIQe4zu6mFLrAGm8VpAmsQgwmWKJJECGRuLIumXSafxOl0U4uT5MxhQTuxn5qBoiDaH2obKOZllcNZ4kAp2-maEFujMWGE7hX+xHiaRv47g5bq9vQblxmKhWgJaghQbQXiorB8HYgpbrEn6slBIooQmkVjxKq4yYVMI9UTj8AC04pmr4WX4k1XwhK1RXHpaAByygqd4I0gigr6tigPY6LAZjyHECF0Bw8gSOgEQIJAHaurBRAUMI8DCNkU3TUIg6IJeCjeb+7Vwj8KWRbw5G7mpPLmPNQT9L+j3TZKTCgypmUA9lBSQ090Ow+D0T5oWR4I-iNTI09x4FQTxNihUw1YLYJMk5WMQgwt6OWPmNPVvjxOpKz01+BzxNTETVNU2TBKvB1jLC2jPSfQWvhFsKlP81TNONOLkvMz8cvy097Ma9NvPc-zgsder2vTYrX6Mx1at62zesBB6p3yBztsIPb+NO-bRupGevg9WbXBHpalIcOgkD4o6riqqg0C0BBS24Bx7mMSOPnRbJTALW4RPZBsATrJs42hGY+cYnLTUBEXctthCASeBg2QLdAuQBGMiAtIecsemDPTV26eToO67DTAoQ1os1YSgPuSCxPEOxpCXcwBLMjBF4cYrqNc8hd6AABKdB0j0DBF2YT4vmSxq1p2UBwD6AzpwIl+kEg8WMGnQQr2KloAHrinYgLgMIrplBNLAbIPQKBcyKlMY+r4HYQI8PjDAsBIC0z5gTOkHwvjsDLuiI2T0QhkizkgYe5d8atGJvgeQNwOD0D7kgEQuRoAzmUMPFBT10A9GHlAskODpqQGECEYQAAFOAEEiHYJIW3fG6gkFpgQM3BAojR7cNIQhOAE1u7R1ts+aB4R5CwE0SfO4H5eZdlgJg0AnDDFyx6JoWYyAm6aDltkbIAQbqiA0EgGsKdHD32vn-ABxAr7kFyowPxhxLSFS-kAA).

Special thanks to [Joe Calzaretta](https://medium.com/u/8de511e0bfd9) who inspired me with this approach [here](https://stackoverflow.com/a/69111325/21869664).
