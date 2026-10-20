/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors
        'nexus-bg': '#F5F7FC',        // Main background: Soft cool white
        'nexus-card': '#FFFFFF',      // Cards and panels: Pure white
        'nexus-primary': {
          DEFAULT: '#2457D6',         // Primary accent: Electric blue
          hover: '#1B45B3',
          subtle: '#EEF3FF',
          border: '#D0DCFF',
        },
        'nexus-navy': {
          DEFAULT: '#17233D',         // Main text: Deep navy
          dark: '#0E1729',
          muted: '#52627E',
          light: '#8392A7',
        },
        'nexus-border': '#E4EAF3',    // Subtle blue-grey border
        'nexus-success': {
          DEFAULT: '#10B981',         // Success: Emerald green
          light: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
        },
        'nexus-warning': {
          DEFAULT: '#F59E0B',         // Warning / due soon: Amber
          light: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
        },
        'nexus-danger': {
          DEFAULT: '#EF4444',         // Overdue: Alert red
          light: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'nexus-card': '0 1px 3px 0 rgba(23, 35, 61, 0.04), 0 1px 2px -1px rgba(23, 35, 61, 0.02)',
        'nexus-elevated': '0 4px 16px -2px rgba(23, 35, 61, 0.08), 0 2px 6px -2px rgba(23, 35, 61, 0.04)',
        'nexus-dropdown': '0 10px 25px -5px rgba(23, 35, 61, 0.12), 0 8px 10px -6px rgba(23, 35, 61, 0.06)',
      }
    },
  },
  plugins: [],
}
