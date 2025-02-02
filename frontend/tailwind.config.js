/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			title: [
  				'Barriecito',
  				'sans-serif'
  			],
  		},
		scrollbar: ['rounded']
  	}
  },
  plugins: [
	import("tailwindcss-animate"),     
	import('tailwind-scrollbar')
  ],
}

