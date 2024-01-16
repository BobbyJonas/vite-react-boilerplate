import { atom, type RecoilState } from 'recoil';
type addSuffixToObject<T, P extends string> = {
  [K in keyof T as K extends string ? `${K}${P}` : never]: T[K];
};

export interface CreateStateAtomOptions<T extends Record<string, any>> {
  namespace: string;
  initialState: T;
}

export const createStateAtom = <T extends Record<string, any>>({
  namespace,
  initialState,
}: CreateStateAtomOptions<T>) => {
  type T1 = {
    [key in keyof Required<T>]: T[key] extends undefined ? T[key] | undefined : T[key];
  };
  type AttrsWithAtomSuffix = addSuffixToObject<T1, 'Atom'>;
  const res: {
    [K in keyof AttrsWithAtomSuffix]: RecoilState<AttrsWithAtomSuffix[K]>;
  } = {} as any;

  Object.keys(initialState).forEach((key) => {
    res[`${key}Atom` as keyof AttrsWithAtomSuffix] = atom({
      key: (namespace ? `${namespace}/` : '') + key,
      default: initialState[key],
    });
  });

  return res;
};
