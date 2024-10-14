import React, { useEffect, useState } from "react";
import Chart from "./components/Chart";
import { Bar } from "./types/Bar";

const App: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);

  useEffect(() => {
    fetchBars();
  }, []);

  const fetchBars = async () => {
    try {
      const response = await fetch(
        "https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const loadedBars: Bar[] = data
        .flatMap((segment: any) => segment.Bars)
        .map((entry: any) => ({
          time: entry.Time * 1000,
          open: entry.Open,
          high: entry.High,
          low: entry.Low,
          close: entry.Close,
        }));

      setBars(loadedBars);
    } catch (error) {
      console.error("Error fetching bars:", error);
    }
  };

  return <Chart bars={bars} />;
};

export default App;
