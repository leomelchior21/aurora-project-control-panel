export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                aurora: "0 24px 80px rgba(0, 0, 0, 0.42)",
            },
            colors: {
                ink: "#0f141b",
                mist: "#f3e7d3",
                flare: "#ffbf00",
                signal: "#ff3131",
                anthracite: "#0D1117",
            },
            fontFamily: {
                display: ['"Bebas Neue"', '"Arial Narrow"', "sans-serif"],
                headline: ['"Bebas Neue"', '"Space Grotesk"', '"Segoe UI"', "sans-serif"],
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
