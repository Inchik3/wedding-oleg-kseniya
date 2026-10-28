import { createFileRoute } from "@tanstack/react-router";
import { Invitation } from "@/components/invitation";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Invitation />;
}
