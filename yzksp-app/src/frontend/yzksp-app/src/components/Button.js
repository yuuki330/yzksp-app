import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', ...props }) => {
    const baseClasses = 'font-bold rouded focus:outline-none focus:ring-2 focus:ring-opacity-50';
    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary',
        secondary: 'bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    };
    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;