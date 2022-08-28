declare const RefSymbol: unique symbol;

export interface Ref<T = any> {
  value: T;
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true;
}


// export type UnwrapRefSimple<T> = T extends
//   | Function
//   | CollectionTypes
//   | BaseTypes
//   | Ref
//   | RefUnwrapBailTypes[keyof RefUnwrapBailTypes]
//   ? T
//   : T extends Array<any>
//   ? { [K in keyof T]: UnwrapRefSimple<T[K]> }
//   : T extends object & { [ShallowReactiveMarker]?: never }
//   ? {
//       [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>;
//     }
//   : T;



