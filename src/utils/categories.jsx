export const categories = [
    'Tous',
    'Bars / Restaurants',
    'Loisirs / Sorties',
    'Mode / Beauté',
    'Culture / Musique',
    'Sport / Bien-être',
    'High-tech / Multimédia',
    'Immobilier',
    'Automobile',
    'Voyages / Transports',
    'Enfants / Famille',
    'Maison / Jardin',
    'Prestations de services',
    'Banque / Assurance',
    'Autres',
];

export const getCateroriesColor = (category) => {
    switch (category) {
        case 'Bars / Restaurants':
            return '#FF5733';
        case 'Loisirs / Sorties':
            return '#FFBD33';
        case 'Mode / Beauté':
            return '#DBFF33';
        case 'Culture / Musique':
            return '#75FF33';
        case 'Sport / Bien-être':
            return '#33FFBD';
        case 'High-tech / Multimédia':
            return '#AC33FF';
        case 'Immobilier':
            return '#FF33EC';
        case 'Automobile':
            return '#3352FF';
        case 'Voyages / Transports':
            return '#A80202';
        case 'Enfants / Famille':
            return '#EE137C';
        case 'Maison / Jardin':
            return '#065A54';
        case 'Prestations de services':
            return '#ffffff';
        case 'Banque / Assurance':
            return '#581845';
        case 'Autres':
            return '#33E3FF';
        default:
            return '#fefefe';
    }
};

export const getCategoriesShadowColor = (category) => {
    switch (category) {
        case 'Bars / Restaurants':
            return 'shadow-[#FF5733]/50';
        case 'Loisirs / Sorties':
            return 'shadow-[#FFBD33]/50';
        case 'Mode / Beauté':
            return 'shadow-[#DBFF33]/50';
        case 'Culture / Musique':
            return 'shadow-[#75FF33]/50';
        case 'Sport / Bien-être':
            return 'shadow-[#33FFBD]/50';
        case 'High-tech / Multimédia':
            return 'shadow-[#AC33FF]/50';
        case 'Immobilier':
            return 'shadow-[#FF33EC]/50';
        case 'Automobile':
            return 'shadow-[#3352FF]/50';
        case 'Voyages / Transports':
            return 'shadow-[#A80202]/50';
        case 'Enfants / Famille':
            return 'shadow-[#EE137C]';
        case 'Maison / Jardin':
            return 'shadow-[#065A54]';
        case 'Prestations de services':
            return 'shadow-[#ffffff]';
        case 'Banque / Assurance':
            return 'shadow-[#581845]/50';
        case 'Autres':
            return 'shadow-[#33E3FF]/50';
        default:
            return 'shadow-[#fefefe]/50';
    }
};
