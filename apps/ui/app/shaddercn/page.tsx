import { Playground } from "@/components/generative/playground";

export const metadata = {
  description:
    "Stream agent-generated JSON into a constrained, native design system.",
  title: "Playground — Shaddercn",
};

export default function Page() {
  return (
    <Playground
      agentEnabled={process.env.NODE_ENV !== "production"}
      liveEnabled={Boolean(
        process.env.NODE_ENV !== "production" &&
          process.env.AI_GATEWAY_API_KEY &&
          process.env.SHADDERCN_MODEL,
      )}
    />
  );
}
