/*
 * @Author: Jan
 * @Date: 2024-04-23 22:22:30
 * @LastEditTime: 2024-05-14 17:51:02
 * @FilePath: /EasyAIWeb/tailwind.config.ts
 * @Description: 
 * 
 */
import type { Config } from "tailwindcss";
import colors, { white } from "tailwindcss/colors";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                gray: colors.gray[50],
                darkgray: colors.gray[800],
            },
        },
    },
    plugins: [],
};
export default config;
