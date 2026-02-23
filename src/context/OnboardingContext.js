import React, { createContext, useContext, useReducer } from 'react';

const OnboardingContext = createContext();

const initialProfile = {
    firstName: null,
    lastName: null,
    birthday: null, // { day, month, year } object
    gender: null,
    sexuality: null,
    relationshipType: null,
    datingIntention: null,
    height: null, // { value, unit } object
    hometown: null,
    workplace: null,
    education: null,
    school: null,
    religion: [], // multi-select
    children: null,
    tobacco: null,
    drinking: null,
    location: null,
    photos: [], // array of URIs
    publicBio: null,
    aiBio: null,
    notifications: null,
    isVisible: {
        gender: true,
        sexuality: true,
        relationshipType: true,
        datingIntention: true,
        height: true,
        hometown: true,
        workplace: true,
        education: true,
        school: true,
        religion: true,
        children: true,
        tobacco: true,
        drinking: true,
        location: true,
    }
};

const onboardingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            if (action.field === 'isVisible') {
                return {
                    ...state,
                    isVisible: { ...state.isVisible, [action.key]: action.value }
                };
            }
            return { ...state, [action.field]: action.value };
        default:
            return state;
    }
};

export const OnboardingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(onboardingReducer, initialProfile);
    return (
        <OnboardingContext.Provider value={{ state, dispatch }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};

export default OnboardingContext;
