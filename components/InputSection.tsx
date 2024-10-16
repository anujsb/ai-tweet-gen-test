"use client";

import React, { useState, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tone =
  | "casual"
  | "professional"
  | "funny"
  | "sarcastic"
  | "inspirational"
  | "educational";

export default function InputSection() {
  const [viralTweet, setViralTweet] = useState<string>("");
  const [tone, setTone] = useState<Tone>("casual");
  const [generatedTweets, setGeneratedTweets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerateTweet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedTweets([]);

    if (!viralTweet.trim()) {
      setError("Please enter a viral tweet");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
      const response = await fetch("http://34.44.131.15:5000/generate-tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ viralTweet, tone }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { generatedTweets?: string[] } = await response.json();
      setGeneratedTweets(data.generatedTweets || []);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          console.error("Error details:", error);
          setError(
            `An error occurred while generating the tweet: ${error.message}`
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-20 bg-primary p-10 rounded-xl shadow-lg pointer-events-auto z-50">
      <h2 className="text-3xl font-bold mb-6 text-text">Generate Your Tweet</h2>
      <form onSubmit={handleGenerateTweet} className="space-y-4 pointer-events-auto">
        <div>
          <label
            htmlFor="viral-tweet"
            className="block mb-2 font-semibold text-text"
          >
            Viral Tweet for Reimagining
          </label>
          <Textarea
            id="viral-tweet"
            rows={4}
            className="w-full p-2 border border-secondary rounded placeholder:text-text text-lg text-text"
            placeholder="Paste the viral tweet here..."
            value={viralTweet}
            onChange={(e) => setViralTweet(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="tone" className="block mb-2 font-semibold text-text">
            Preferred Tone for Generated Tweet
          </label>

          <Select value={tone} onValueChange={(value: Tone) => setTone(value)}>
            <SelectTrigger className="w-[180px] text-text border-secondary">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="funny">Funny</SelectItem>
              <SelectItem value="sarcastic">Sarcastic</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          type="submit"
          className="bg-accent hover:bg-[#b06b37] text-text font-bold py-2 px-4 rounded transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Tweets"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-destructive-foreground text-destructive rounded">
          {error}
        </div>
      )}

      {generatedTweets.length > 0 && (
        <div className="mt-8 ">
          <h3 className="text-2xl font-bold mb-4 text-text">
            Generated Tweets
          </h3>
          <div className="space-y-4 pointer-events-auto">
            {generatedTweets.map((tweet, index) => (
              <div
                key={index}
                className="p-4 border border-secondary rounded shadow-sm bg-"
              >
                <p className="text-bk ">{tweet}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
