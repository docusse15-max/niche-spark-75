import { useActivityTracker } from "@/hooks/useActivityTracker";

interface Props {
  currentUser: string;
  children: React.ReactNode;
}

export function ActivityTrackerProvider({ currentUser, children }: Props) {
  useActivityTracker(currentUser);
  return <>{children}</>;
}
