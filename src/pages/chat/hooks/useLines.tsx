import { useState, useEffect } from "react";
import { Line, LINES } from "common/types/line.type";

export default function useLines() {
  const [lines] = useState<Line[]>(LINES);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(false); // Will be used when API is integrated
  const [defaultSelected, setDefaultSelected] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchLines = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch('/api/lines');
    //     const data = await response.json();
    //     setLines(data.lines);
    //     setDefaultSelected(data.defaultSelected || []);
    //     setSelectedLines(data.defaultSelected || []);
    //   } catch (error) {
    //     console.error("Failed to fetch lines:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchLines();

    // Static default: First line is selected by default
    const defaultLine = "line1";
    setDefaultSelected([defaultLine]);
    setSelectedLines([defaultLine]);
  }, []);

  const updateSelectedLines = async (newSelectedLines: string[]) => {
    setSelectedLines(newSelectedLines);

    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/lines/selected', {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ lines: newSelectedLines }),
    //   });
    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error("Failed to update selected lines:", error);
    //   throw error;
    // }
  };

  return {
    lines,
    selectedLines,
    defaultSelected,
    isLoading: false, // Will be used when API is integrated
    updateSelectedLines,
  };
}


