export const categories = [
    'Bars / Restaurants',
    'Loisirs / Sorties',
    'Mode / Beauté',
    'Sport / Bien-être',
    'High-tech / Multimédia',
    'Voyages / Transports',
    'Maison / Jardin',
    'Prestations de services',
    'Banque / Assurance',
    'Autres',
];

export const getCateroriesColor = (category) => {
    switch (category) {
        case 'Bars / Restaurants':
            return '#05FFE8';
        case 'Loisirs / Sorties':
            return '#FAFF05';
        case 'Mode / Beauté':
            return '#FF05DE';
        case 'Sport / Bien-être':
            return '#FFA305';
        case 'High-tech / Multimédia':
            return '#FFFFFF';
        case 'Voyages / Transports':
            return '#00FF30';
        case 'Maison / Jardin':
            return '#A100F7';
        case 'Prestations de services':
            return '#FB0000';
        case 'Banque / Assurance':
            return '#0415F8';
        case 'Autres':
            return '#9F5C04';
        default:
            return '#fefefe';
    }
};

export const getCategoriesShadowColor = (category) => {
    switch (category) {
        case 'Bars / Restaurants':
            return 'shadow-[#05FFE8]/50';
        case 'Loisirs / Sorties':
            return 'shadow-[#FAFF05]/50';
        case 'Mode / Beauté':
            return 'shadow-[#FF05DE]/50';
        case 'Sport / Bien-être':
            return 'shadow-[#FFA305]/50';
        case 'High-tech / Multimédia':
            return 'shadow-[#FFFFFF]/50';
        case 'Voyages / Transports':
            return 'shadow-[#00FF30]/50';
        case 'Maison / Jardin':
            return 'shadow-[#A100F7]/50';
        case 'Prestations de services':
            return 'shadow-[#FB0000]/50';
        case 'Banque / Assurance':
            return 'shadow-[#0415F8]/50';
        case 'Autres':
            return 'shadow-[#9F5C04]/50';
        default:
            return 'shadow-[#fefefe]/50';
    }
};
