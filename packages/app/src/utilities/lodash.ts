export function isEqual(firstValue: unknown, secondValue: unknown): boolean {
  const isFirstObject = typeof firstValue === "object" && firstValue !== null;
  const isSecondObject =
    typeof secondValue === "object" && secondValue !== null;

  // do a shallow comparison of objects, arrays etc.
  if (isFirstObject && isSecondObject) {
    const keys1 = Object.keys(firstValue);
    const keys2 = Object.keys(secondValue);

    return (
      keys1.length === keys2.length &&
      keys1.every(key => {
        return isEqual(firstValue[key], secondValue[key]);
      })
    );
  }

  // otherwise just compare the values directly
  return firstValue === secondValue;
}
