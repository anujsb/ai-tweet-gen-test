import Image from "next/image";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
export default function Home() {
  return (
    <div className="bg-background text-text">
      <Header />
      <Hero />
    </div>
  );
}
