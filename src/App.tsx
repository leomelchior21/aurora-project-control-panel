import { useEffect, useMemo, useState } from "react";
import { cityData } from "./data/cities";
import { LoadingScreen } from "./components/LoadingScreen";
import { CitySelectionHub } from "./components/CitySelectionHub";
import { CityDashboard } from "./components/CityDashboard";
import type { CitySlug } from "./types";

function App() {
  const cities = useMemo(() => cityData, []);
  const [selectedCity, setSelectedCity] = useState<CitySlug | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setProgress((current) => Math.min(current + 10, 100));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [progress]);

  if (progress < 100) {
    return <LoadingScreen progress={progress} />;
  }

  if (!selectedCity) {
    return <CitySelectionHub cities={cities} onSelect={setSelectedCity} />;
  }

  const city = cities.find((entry) => entry.slug === selectedCity);

  if (!city) {
    return <CitySelectionHub cities={cities} onSelect={setSelectedCity} />;
  }

  return (
    <CityDashboard
      city={city}
      cities={cities}
      onBack={() => setSelectedCity(null)}
      onSelectCity={setSelectedCity}
    />
  );
}

export default App;
