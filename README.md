# Align Onboarding

Modularized React Native onboarding flow for the Align app.

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── AgeConfirmationModal.js
│   ├── BackButton.js
│   ├── FAB.js
│   ├── OptionRow.js
│   ├── PremiumScreenWrapper.js
│   ├── StepIndicator.js
│   └── VisibilityToggle.js
├── constants/           # App constants
│   ├── colors.js
│   └── steps.js
├── context/             # React Context for state management
│   └── OnboardingContext.js
├── screens/             # Modular screen components
│   ├── BirthdayScreen.js
│   ├── ChildrenScreen.js
│   ├── DatingIntentionScreen.js
│   ├── DrinkingScreen.js
│   ├── EducationScreen.js
│   ├── GenderScreen.js
│   ├── HeightScreen.js
│   ├── HometownScreen.js
│   ├── LocationScreen.js
│   ├── NameScreen.js
│   ├── NotificationsScreen.js
│   ├── PhotosScreen.js
│   ├── RelationshipTypeScreen.js
│   ├── ReligionScreen.js
│   ├── ReviewScreen.js
│   ├── SchoolScreen.js
│   ├── SexualityScreen.js
│   ├── SuccessScreen.js
│   └── WorkplaceScreen.js
├── styles/              # Global and shared styles
│   └── shared.js
└── utils/               # Helper functions and API logic
    ├── dateHelpers.js
    ├── submitProfile.js
    └── validateProfile.js
```

## Key Features

- **Modular Architecture**: Complete separation of concerns for easier maintenance and testing.
- **Centralized State**: Uses React Context (`OnboardingContext`) and `useReducer` for global onboarding state.
- **Dynamic Navigation**: Single source of truth for the onboarding sequence in `constants/steps.js`.
- **Premium UI**: Integrated animations, custom fonts (Inter & Playfair Display), and monochrome aesthetics.
- **Environment Config**: Uses `.env` for API URLs.

## Getting Started

1. Set up your `.env` file based on `.env.example`.
2. Run `npm install`.
3. Start the dev server: `npm run start`.

## Environment Variables

- `EXPO_PUBLIC_API_URL`: The endpoint where the profile data will be submitted.
