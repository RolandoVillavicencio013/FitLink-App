# FitLink-App

FitLink is a cross-platform application designed to help users track their physical activity, with a primary focus on gym-goers. Built with Expo, React Native, and TypeScript, FitLink supports both Android and iOS platforms.

The app allows users to create workout routines from a predefined list of exercises, log their training sessions, and engage with a social layer that encourages interaction. Users can share their routines, explore others’ workouts, and save routines that match their goals.

This initiative was born from a desire to offer a reliable and innovative alternative in the fitness space — one that emphasizes community support and mutual improvement. By enabling users to exchange routines and advice, FitLink fosters a collaborative environment where progress is shared and celebrated.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v18 or higher recommended). You can download it [here](https://nodejs.org/).

## Dependency Management

FitLink uses the package versions recommended by Expo for maximum compatibility and stability. While some internal dependencies may show deprecation warnings, following Expo’s suggestions ensures that the app works reliably across platforms and with Expo tooling. This approach is preferred over always using the latest package versions, as Expo maintains and tests its supported versions for seamless integration.  
If you choose to update dependencies beyond Expo’s recommendations, you may encounter compatibility issues or unexpected behavior.

## Project Setup

### 1. Clone the Project

```
git clone https://github.com/erickhernandezdev/FitLink-App.git
```

### 2. Access the project folder

```
cd FitLink-App/FitLink
```

### 3. Download the necessary npm packages

```
npm install
```

### 4. Run the project

```
npx expo start
```

**Note:** If you want to try it on Android, you must download Expo Go from the Play Store and scan the QR code. For iOS, you only need to scan the QR code with your phone's camera.

## Linting & Formatting

We use ESLint to enforce best practices and catch common errors in both JavaScript and TypeScript.


To run lint checks:

```
npx eslint .
```

To automatically fix issues:

```
npx eslint . --fix
```

The ESLint config is located in `eslint.config.cjs`.

## Testing

This project uses Jest and React Native Testing Library to ensure component reliability and maintainable logic across platforms.

To run Tests

```
npx jest
```

Tests are located in the `/tests` directory and follow the `.test.tsx` naming convention.

To generate a coverage report:

```
npx jest --coverage
```

## Project Structure

FitLink is organized to support modular development and clear onboarding. Here's a breakdown of the main folders:

- **app/:** Contains all the routed screens using Expo Router. Each file or folder here maps directly to a route. Includes tab navigation, layout definitions, and entry points like index.tsx.

- **components/:** Reusable UI components shared across screens, such as styled text blocks, info cards, or custom buttons.

- **assets/:** Static resources like fonts, images, and icons used throughout the app.

- **tests/:** Unit and integration tests for components and screens.

## Authors

- Erick Hernández Hernández
- Brayan Rivera Navarro
- Rolando Villavicencio González