
   export const getButtonText = (planName) => {
        switch (planName.toLowerCase()) {
            case 'free':
                return 'Start Free';
            case 'basic':
                return 'Get Started';
            case 'premium':
                return 'Go Premium';
            case 'pro':
                return 'Go Pro';
            default:
                return 'Choose Plan';
        }
    };

    export const getButtonStyle = (planName) => {
        switch (planName.toLowerCase()) {
            case 'free':
                return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600';
            case 'basic':
                return 'bg-indigo-600 text-white hover:bg-indigo-700';
            case 'premium':
                return 'bg-orange-600 text-white hover:bg-orange-700';
            case 'pro':
                return 'bg-red-600 text-white hover:bg-orange-700';
            default:
                return 'bg-gray-600 text-white hover:bg-gray-700';
        }
    };

    export const capitalizePlanName = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };