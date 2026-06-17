import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WarmupContextValue = {
  isWarmingUp: boolean;
  completeWarmup: () => void;
};

const WarmupContext = createContext<WarmupContextValue>({
  isWarmingUp: false,
  completeWarmup: () => {},
});

export function WarmupProvider({
  children,
  initialWarmingUp = false,
}: {
  children: ReactNode;
  initialWarmingUp?: boolean;
}) {
  const [isWarmingUp, setIsWarmingUp] = useState(initialWarmingUp);
  const completeWarmup = useCallback(() => setIsWarmingUp(false), []);

  const value = useMemo(
    () => ({ isWarmingUp, completeWarmup }),
    [completeWarmup, isWarmingUp],
  );

  return (
    <WarmupContext.Provider value={value}>{children}</WarmupContext.Provider>
  );
}

export function useWarmupState() {
  return useContext(WarmupContext);
}
