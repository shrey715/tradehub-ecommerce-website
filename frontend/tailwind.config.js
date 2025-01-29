/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Noto Sans',
  				'sans-serif'
  			],
  			cursive: [
  				'Pacifico',
  				'cursive'
  			],
  			rubik: [
  				'Rubik',
  				'sans-serif'
  			],
  			title: [
  				'Barriecito',
  				'sans-serif'
  			],
  			poppins: [
  				'Poppins',
  				'sans-serif'
  			]
  		},
		scrollbar: ['rounded']
  	}
  },
  plugins: [
	import("tailwindcss-animate"),     
	import('tailwind-scrollbar')
  ],
}

