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

export function formatSeconds(seconds = 0): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(1, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
