export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                aurora: "0 24px 80px rgba(5, 10, 32, 0.35)",
            },
            colors: {
                ink: "#06111f",
                mist: "#d9e4f1",
                flare: "#f4c76c",
            },
            fontFamily: {
                display: ['"Bebas Neue"', '"Arial Narrow"', "sans-serif"],
                headline: ['"Monument Extended"', '"Space Grotesk"', '"Segoe UI"', "sans-serif"],
                body: ['"Space Grotesk"', '"Segoe UI"', "sans-serif"],
            },
            keyframes: {
                pulseGlow: {
                    "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.06)" },
                },
                riseIn: {
                    from: { opacity: "0", transform: "translateY(18px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "pulse-glow": "pulseGlow 2.2s ease-in-out infinite",
                "rise-in": "riseIn 0.7s ease-out both",
            },
        },
    },
    plugins: [],
};
