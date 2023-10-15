# Dario Dumlijan - Web Portfolio

### Requirements

#### Node.js & yarn

Node version `18.0` and up needed to run the React scripts. And yarn to run the scripts and handle dependencies.

### Development

Install node dependencies:

    yarn (install)

Run dev server for development in the browser:

    yarn start

To build application for production:

    yarn build

Run test handled by [testing-library](https://vitest.dev/):

    yarn test

To deploy the app with firebase (*firebase-cli needed):

    yarn deploy

### Environment Variables

Add `.env` file to root directory. Variables must start with a prefix `VITE_`. Variable named `VITE_API_URL` is then accessed in the code with

    process.env.VITE_API_URL

Node variables are populated only during initial dev server load, so restart server when adding or updating variables.

#### A list of all used variables
    ESLINT_NO_DEV_ERRORS="true"

#### Other env variables

During development, you can avoid your webpack build failing because of `eslint` errors by adding env variable:

    ESLINT_NO_DEV_ERRORS="true"