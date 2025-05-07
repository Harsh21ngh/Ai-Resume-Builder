/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}", // important for shadcn components
    ],
    theme: {
        extend: {
          colors: {
            primary: "#9f5bff",
            "primary-foreground": "#ffffff",
          },
        },
      },
      
    plugins: [],
  }
  