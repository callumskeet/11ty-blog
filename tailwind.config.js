/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,liquid}'],
    theme: {
        screens: {},
        fontSize: {
            // TODO: calculate line heights
            '2xs': 'var(--step--2)',
            'xs': 'var(--step--1)',
            'base': 'var(--step-0)',
            'lg': 'var(--step-1)',
            'xl': 'var(--step-2)',
            '2xl': 'var(--step-3)',
            '3xl': 'var(--step-4)',
            '4xl': 'var(--step-5)',
        },
        spacing: {
            // Individual space values
            '3xs': 'var(--space-3xs)',
            '2xs': 'var(--space-2xs)',
            'xs': 'var(--space-xs)',
            's': 'var(--space-s)',
            'm': 'var(--space-m)',
            'l': 'var(--space-l)',
            'xl': 'var(--space-xl)',
            '2xl': 'var(--space-2xl)',
            '3xl': 'var(--space-3xl)',

            // Space value pairs - single steps
            '3xs-2xs': 'var(--space-3xs-2xs)',
            '2xs-xs': 'var(--space-2xs-xs)',
            'xs-s': 'var(--space-xs-s)',
            's-m': 'var(--space-s-m)',
            'm-l': 'var(--space-m-l)',
            'l-xl': 'var(--space-l-xl)',
            'xl-2xl': 'var(--space-xl-2xl)',
            '2xl-3xl': 'var(--space-2xl-3xl)',
        },
        container: {},
        extend: {},
    },
    plugins: [],
};

/**
 *

:root {
    '3xs': 'clamp(0.25rem, 0.2283rem + 0.1087vi, 0.3125rem)',
    '2xs': 'clamp(0.5rem, 0.4783rem + 0.1087vi, 0.5625rem)',
    'xs': 'clamp(0.75rem, 0.7065rem + 0.2174vi, 0.875rem)',
    's': 'clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem)',
    'm': 'clamp(1.5rem, 1.4348rem + 0.3261vi, 1.6875rem)',
    'l': 'clamp(2rem, 1.913rem + 0.4348vi, 2.25rem)',
    'xl': 'clamp(3rem, 2.8696rem + 0.6522vi, 3.375rem)',
    '2xl': 'clamp(4rem, 3.8261rem + 0.8696vi, 4.5rem)',
    '3xl': 'clamp(6rem, 5.7391rem + 1.3043vi, 6.75rem)',

    '3xs-2xs': 'clamp(0.25rem, 0.1413rem + 0.5435vi, 0.5625rem)',
    '2xs-xs': 'clamp(0.5rem, 0.3696rem + 0.6522vi, 0.875rem)',
    'xs-s': 'clamp(0.75rem, 0.6196rem + 0.6522vi, 1.125rem)',
    's-m': 'clamp(1rem, 0.7609rem + 1.1957vi, 1.6875rem)',
    'm-l': 'clamp(1.5rem, 1.2391rem + 1.3043vi, 2.25rem)',
    'l-xl': 'clamp(2rem, 1.5217rem + 2.3913vi, 3.375rem)',
    'xl-2xl': 'clamp(3rem, 2.4783rem + 2.6087vi, 4.5rem)',
    '2xl-3xl': 'clamp(4rem, 3.0435rem + 4.7826vi, 6.75rem)',


    '2xs': 'clamp(0.7901rem, 0.7558rem + 0.1718vi, 0.8889rem)',
    'xs': 'clamp(0.8889rem, 0.8502rem + 0.1932vi, 1rem)',
    'base': 'clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem)',
    'lg': 'clamp(1.125rem, 1.0761rem + 0.2446vi, 1.2656rem)',
    'xl': 'clamp(1.2656rem, 1.2106rem + 0.2751vi, 1.4238rem)',
    '2xl': 'clamp(1.4238rem, 1.3619rem + 0.3095vi, 1.6018rem)',
    '3xl': 'clamp(1.6018rem, 1.5322rem + 0.3482vi, 1.802rem)',
    '4xl': 'clamp(1.802rem, 1.7237rem + 0.3917vi, 2.0273rem)',
  }
 */
