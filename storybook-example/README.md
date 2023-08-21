# Storybook Example

Storybook example for all mosip-plugins.

## Creating Stories in this Storybook

First of all you have to create a react component wrapper for your plugins, which will be used in storybook, inside src folder.

### React based plugins

If you have react based plugins then you have to create a wrapper component like this way

```js
// import your react component
import { SecureBiometricInterfaceIntegrator } from "../../react-secure-biometric-interface-integrator/src/index";

// create a functional component that return an HTML Element with the component inside it
// use args to pass on, in your react component
function ReactSbi(args) {
  return (
    // wrap you actual component with some styling
    <div style={{STYLING}}>
        <!-- call your react component with all of your arguments -->
        <SecureBiometricInterfaceIntegrator {...args} />
    </div>
  );
}

// export that functional component
export default ReactSbi;
```

### Javascript based plugins

If you have plain javascript based plugins then you have to create a wrapper component like this way

```js
import { useEffect } from "react";

// importing your javascript component
import init from "../../sign-in-with-esignet/src/lib/SignInWithEsignet/SignInWithEsignet";

// create a functional component that return an HTML Element with the component inside it
// use individual arguments which your javascript will need
function SignInWithEsignet({ oidcConfig, buttonConfig, id }) {
  // use useEffect to call your javascript component
  useEffect(() => {
    init({
      oidcConfig,
      buttonConfig,
      signInElement: document.getElementById(id),
      style: {
        fontFamily: "'Cera Pro Bold', Arial, sans-serif",
      },
    });
  }, [oidcConfig, buttonConfig]);

  return (
    // wrap you actual component with some styling
    <div style={{ STYLING }}>
      <!-- use id to show the component inside this div -->
      <div id={id}></div>
    </div>
  );
}

// export your functional component
export default SignInWithEsignet;
```

First you have to create a default value stating the detail for the story

```js
// import Meta & StoryObj from @storybook/react package
import type { Meta, StoryObj } from "@storybook/react";

// you can name anything in COMPONENT_META
const COMPONENT_META =  {
  title: STORY_TITLE, // title of the Main story
  tags: ["autodocs"], // for story docs
  component: YOUR_REACT_WRAPPER_COMPONENT, // wrapper component which you have created in src folder
  argTypes: ARG_TYPE_OBJECT, // arguments which have to be pass in the component
} as Meta;
export default COMPONENT_META;
// type creation which will be used in stories
type Story = StoryObj<typeof COMPONENT_META>
```

Now create a specific story for the component

```js
export const SignInWithEsignetStory: Story = {
  args: ARGS_OBJECT, // passing all necessary inputs
};
```


# Storybook Deployment

## Github Pages

First of all you have to change `homepage` value in `package.json` file, according to your need where you want to deploy it (in which repo)

After that you just have to run below command

```cmd
npm run publish
```

## Deploy static folder

For deploying static folder, you need to build storybook by running the below command

```cmd
npm run build
```

Above command create a folder name `storybook-static`, you can copy paste this folder anywhere and serve it as a static folder website.

## Deployed multiple version of storybook

### Environment Variables

| Variable Name | Description | Default Value Production | Default Value Local |
| ------------- | ----------- | ------------- | -----------|
| BASE_PATH     | Base path for the reference storybook | `mosip-plugins` | `http://127.0.0.1/storybook-example/storybook-static` |
| PLUGINS_FOLDER | Comma separated folder name of al the plugin | `react-secure-biometric-interface-integrator, react-sign-in-with-esignet, sign-in-with-esignet, secure-biometric-interface-integrator` | `react-secure-biometric-interface-integrator, react-sign-in-with-esignet, sign-in-with-esignet, secure-biometric-interface-integrator` |
| VERSION_BRANCH | Name of the branch which you want to add in the storybook reference | `release-0.9.0` | `release-0.9.0` |

For deploying multiple version of storybook in a single github pages, then you have to first provide value to the variable in the environment file `.env.production` then you have to run this command:

```cmd
npm run build:version:production
```

If you want to run it locally then you have to provide environment variables value in `env.local` and then run this command:

```cmd
npm run build:version:local
```

It will create stories from the current branch and as well as the branch you have specify in the `VERSION_BRANCH` environment variable, in a comma separated way.

It will also deploy the those stories in the github pages (taking homepage as the url).

``
NOTE: If `VERSION_BRANCH` is empty then it will deploy only the current branch stories
``



# Storybook Example Setup

```cmd
npx storybook@latest init -t web_components
```

after that select `webpack 5` as a builder for your project

## Typescript

If you have your library written in typescript then you also have to add `ts-loader`

```cmd
npm i -D typescript ts-loader typescript-plugin-css-modules @babel/preset-typescript @types/jest @types/node
```

after that add some webpack config in `main.ts | main.js`

```js
const config: StorybookConfig = {
    ...
    ...
    webpackFinal: async (config) => {
        config?.module?.rules?.push({
        test: /\.(ts|tsx)$/,
        include: [SRC_PATH, STORIES_PATH],
        use: [
            {
            loader: require.resolve("ts-loader"),
            },
        ],
        });
        config?.resolve?.extensions?.push(".ts", ".tsx");
        return config;
    },
    ...
    ...
}
```

where `SRC_PATH` will be the path for your typescript component library, and `STORIES_PATH` will be the path for the stories.

Also add this snippet in `.babelrc.json`

```js
{
  ...
  "presets": [
    ...
    "@babel/preset-typescript"
    ...
  ],
  ...
}
```

