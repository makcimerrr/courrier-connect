import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '1rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji',
  				'Segoe UI Emoji',
  				'Segoe UI Symbol',
  				'Noto Color Emoji'
  			],
  			serif: [
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			laposte: {
  				yellow: 'hsl(var(--laposte-yellow))',
  				'yellow-light': 'hsl(var(--laposte-yellow-light))',
  				'yellow-dark': 'hsl(var(--laposte-yellow-dark))',
  				blue: 'hsl(var(--laposte-blue))',
  				'blue-light': 'hsl(var(--laposte-blue-light))',
  				'blue-dark': 'hsl(var(--laposte-blue-dark))'
  			},
  			status: {
  				signaled: 'hsl(var(--status-signaled))',
  				'in-progress': 'hsl(var(--status-in-progress))',
  				pending: 'hsl(var(--status-pending))',
  				resolved: 'hsl(var(--status-resolved))',
  				urgent: 'hsl(var(--status-urgent))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			card: 'var(--shadow-card)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'pulse-soft': {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.7'
  				}
  			},
  			'slide-up': {
  				from: {
  					transform: 'translateY(100%)',
  					opacity: '0'
  				},
  				to: {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'fade-in': {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			'ring-pulse': {
  				'0%': {
  					transform: 'scale(1)',
  					opacity: '0.4'
  				},
  				'50%': {
  					transform: 'scale(1.2)',
  					opacity: '0.1'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '0.4'
  				}
  			},
  			'urgent-pulse': {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 hsl(var(--status-urgent) / 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 0 8px hsl(var(--status-urgent) / 0)'
  				}
  			},
  			'pin-bounce': {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-4px)'
  				}
  			},
  			'check-draw': {
  				'0%': {
  					strokeDashoffset: '50'
  				},
  				'100%': {
  					strokeDashoffset: '0'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					transform: 'scale(0.8)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			'circle-draw': {
  				'0%': {
  					strokeDashoffset: '226'
  				},
  				'100%': {
  					strokeDashoffset: '0'
  				}
  			},
  			'check-path': {
  				'0%': {
  					strokeDashoffset: '24'
  				},
  				'100%': {
  					strokeDashoffset: '0'
  				}
  			},
  			'confetti': {
  				'0%': {
  					transform: 'translateY(0) translateX(0) scale(1)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateY(-60px) translateX(var(--confetti-x, 30px)) scale(0)',
  					opacity: '0'
  				}
  			},
  			'ripple': {
  				'0%': {
  					transform: 'scale(0)',
  					opacity: '0.5'
  				},
  				'100%': {
  					transform: 'scale(4)',
  					opacity: '0'
  				}
  			},
  			'bounce-in': {
  				'0%': {
  					transform: 'scale(0.3)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
  			'slide-up': 'slide-up 0.3s ease-out',
  			'fade-in': 'fade-in 0.2s ease-out',
  			'ring-pulse': 'ring-pulse 2s ease-out infinite',
  			'urgent-pulse': 'urgent-pulse 1s ease-in-out infinite',
  			'pin-bounce': 'pin-bounce 0.3s ease-out',
  			'check-draw': 'check-draw 0.5s ease-out forwards',
  			'scale-in': 'scale-in 0.2s ease-out',
  			'shimmer': 'shimmer 2s linear infinite',
  			'circle-draw': 'circle-draw 0.6s ease-out forwards',
  			'check-path': 'check-path 0.3s ease-out 0.4s forwards',
  			'confetti': 'confetti 0.8s ease-out forwards',
  			'ripple': 'ripple 0.6s ease-out',
  			'bounce-in': 'bounce-in 0.5s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
