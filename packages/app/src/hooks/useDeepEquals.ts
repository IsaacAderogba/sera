import {
  Context,
  useContext,
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from "react";
import { isEqual } from "../utilities/lodash";

export function useDeepMemo<T, TDependencyList extends DependencyList>(
  factory: () => T,
  deps: readonly [...TDependencyList],
  depsAreEqual?: DepsAreEqual<readonly [...TDependencyList]>
): T {
  return useMemo(factory, useDeepMemoize(deps, depsAreEqual));
}

function useDeepMemoize<TDependencyList extends DependencyList>(
  deps: readonly [...TDependencyList],
  depsAreEqual: DepsAreEqual<readonly [...TDependencyList]> = (
    prevDeps,
    nextDeps
  ) => isEqual(prevDeps, nextDeps)
) {
  const ref = useRef<readonly [...TDependencyList] | undefined>(undefined);

  if (!ref.current || !depsAreEqual(ref.current, deps)) {
    ref.current = deps;
  }

  return ref.current;
}

export function useDeepEffect<TDependencyList extends DependencyList>(
  effect: EffectCallback,
  deps: readonly [...TDependencyList],
  depsAreEqual?: DepsAreEqual<readonly [...TDependencyList]>
) {
  useEffect(effect, useDeepMemoize(deps, depsAreEqual));
}

export function useDeepLayoutEffect<TDependencyList extends DependencyList>(
  effect: EffectCallback,
  deps: readonly [...TDependencyList],
  depsAreEqual?: DepsAreEqual<readonly [...TDependencyList]>
) {
  useLayoutEffect(effect, useDeepMemoize(deps, depsAreEqual));
}

type DepsAreEqual<TDependencyList extends DependencyList> = (
  prevDeps: TDependencyList,
  nextDeps: TDependencyList
) => boolean;
