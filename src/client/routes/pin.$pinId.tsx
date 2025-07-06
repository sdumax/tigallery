import { createFileRoute } from "@tanstack/react-router";
import { PinDetails } from "../components/pages/PinDetails";

export const Route = createFileRoute("/pin/$pinId")({
  component: PinDetailsPage,
});

function PinDetailsPage() {
  const { pinId } = Route.useParams();

  return <PinDetails pinId={pinId} />;
}
