import type { Metadata } from "next";
import StoryView from "./components/StoryView";

export const metadata: Metadata = {
  title: "2025 · 留白",
  description:
    "歲末、夢、我是誰、午夜飛行、最後的特拉阿托尼、雨西湖、旅行、留白。一個難以定義的年份的意識流年終總結。",
  openGraph: {
    title: "2025 · 留白",
    description: "一個難以回憶、難以定義的年份。不如我們留白。",
  },
};

export default function Page2025() {
  return <StoryView />;
}
