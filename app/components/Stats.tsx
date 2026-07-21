import { getPublicCommunity } from "@/lib/public-community";
import { AnimatedStats } from "./AnimatedStats";

export default async function Stats() {
  const community = await getPublicCommunity();
  return <AnimatedStats stats={[
    { value: 5000, suffix: "+", label: "Practice questions" },
    { value: 49, suffix: "+", label: "Realistic mock exams" },
    { value: community.displayedCommunitySize, suffix: "+", label: "Students preparing" },
    { value: 4.8, suffix: "★", decimals: 1, label: "Average app rating" },
  ]} />;
}
