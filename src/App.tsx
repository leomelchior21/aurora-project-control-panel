import { useEffect, useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppRouter } from "./app/router/AppRouter";

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;
    const timeout = window.setTimeout(() => setProgress((value) => Math.min(100, value + 12)), 220);
    return () => window.clearTimeout(timeout);
  }, [progress]);

  if (progress < 100) {
    return <LoadingScreen progress={progress} />;
  }

  return <AppRouter />;
}

export default App;
