import { useCallback, useEffect, useState } from "react";

export function useCooldown(initialSeconds = 0) {
  const [cooldown, setCooldown] = useState(initialSeconds);

  useEffect(() => {
    if (cooldown <= 0) return;

    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const startCooldown = useCallback((from: number) => setCooldown(from), []);

  return { cooldown, startCooldown };
}
