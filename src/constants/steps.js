export const STEP_ORDER = [
    'name', 'birthday', 'gender', 'sexuality', 'relationshipType', 'datingIntention', // Chapter 1: About You
    'height', 'hometown', 'workplace', 'education', 'school', 'religion', 'children', 'tobacco', 'drinking', 'location', // Chapter 2: Your Life
    'photos', 'bio', 'verification', 'notifications' // Chapter 3: Your Photos
];

export const STEP_CONFIG = [
    { id: 'name', icon: 'person-outline', library: 'MaterialIcons' },
    { id: 'birthday', icon: 'cake-variant-outline', library: 'MaterialCommunityIcons' },
    { id: 'gender', icon: 'gender-male-female', library: 'MaterialCommunityIcons' },
    { id: 'sexuality', icon: 'heart', library: 'Feather' },
    { id: 'relationshipType', icon: 'users', library: 'Feather' },
    { id: 'datingIntention', icon: 'search', library: 'Feather' },
    { id: 'height', icon: 'ruler', library: 'MaterialCommunityIcons' },
    { id: 'hometown', icon: 'home', library: 'Feather' },
    { id: 'workplace', icon: 'briefcase', library: 'Feather' },
    { id: 'education', icon: 'book-open', library: 'Feather' },
    { id: 'school', icon: 'book-open', library: 'Feather' },
    { id: 'religion', icon: 'hands-pray', library: 'MaterialCommunityIcons' },
    { id: 'children', icon: 'stroller', library: 'MaterialIcons' },
    { id: 'tobacco', icon: 'smoking-rooms', library: 'MaterialIcons' },
    { id: 'drinking', icon: 'local-bar', library: 'MaterialIcons' },
    { id: 'location', icon: 'map-pin', library: 'Feather' },
    { id: 'photos', icon: 'photo-library', library: 'MaterialIcons' },
    { id: 'bio', icon: 'edit', library: 'Feather' },
    { id: 'verification', icon: 'verified-user', library: 'MaterialIcons' },
    { id: 'notifications', icon: 'bell', library: 'Feather' },
];

export const CHAPTER_CONFIG = [
    { id: 'about', label: 'Chapter 1: About You', steps: ['name', 'birthday', 'gender', 'sexuality', 'relationshipType', 'datingIntention'] },
    { id: 'life', label: 'Chapter 2: Your Life', steps: ['height', 'hometown', 'workplace', 'education', 'school', 'religion', 'children', 'tobacco', 'drinking', 'location'] },
    { id: 'photos', label: 'Chapter 3: Your Photos', steps: ['photos', 'bio', 'verification', 'notifications'] },
];

export default { STEP_ORDER, STEP_CONFIG, CHAPTER_CONFIG };
