import { MutableRefObject, useEffect, useState } from "react";

interface Size {
  width: number;
  height: number;
}

export const useComponentSize = <T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  defaultSize: Size = { width: 0, height: 0 }
) => {
  const [size, setSize] = useState<Size>(defaultSize);

  const node = ref.current;
  useEffect(() => {
    if (!node) return;

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(({ target }) => {
        const width = target.clientWidth;
        const height = target.clientHeight;

        setSize(size => {
          if (size.width !== width || size.height !== height) {
            return { width, height };
          }

          return size;
        });
      });
    });

    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [node]);

  return size;
};
