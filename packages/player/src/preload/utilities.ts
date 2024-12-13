export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms = 500
) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};
