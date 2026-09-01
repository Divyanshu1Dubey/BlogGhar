import { useState, useEffect } from "react";

interface UseDebounceOptions {
  delay?: number;
}

export function useDebounce<T>(value: T, options: UseDebounceOptions = {}): T {
  const { delay = 500 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
