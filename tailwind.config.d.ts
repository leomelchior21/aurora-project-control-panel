declare const _default: {
    content: string[];
    theme: {
        extend: {
            boxShadow: {
                aurora: string;
            };
            colors: {
                ink: string;
                mist: string;
                flare: string;
            };
            fontFamily: {
                display: [string, string, string];
                headline: [string, string, string, string];
                body: [string, string, string];
            };
            keyframes: {
                pulseGlow: {
                    "0%, 100%": {
                        opacity: string;
                        transform: string;
                    };
                    "50%": {
                        opacity: string;
                        transform: string;
                    };
                };
                riseIn: {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
            };
            animation: {
                "pulse-glow": string;
                "rise-in": string;
            };
        };
    };
    plugins: any[];
};
export default _default;
