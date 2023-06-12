# Storybook Example

Storybook example for sign-in-with-esignet & secure-biometric-device library and how to show the in one place.


## Creating Stories in this Storybook


First you have to create a default value stating the detail for the story

```js
export default {
  title: STORY_TITLE, // title of the Main story
  tags: ["autodocs"], // for story docs
  render: (args) => renderComponent(args), // rendering the component which take args as parameter
  argTypes: ARG_TYPE_OBJECT, // arguments which have to be pass in the component
};
```

and similarly if you have typescript component then you can add this

```js
export default {
  title: STORY_TITLE, // title of the Main story
  tags: ["autodocs"], // for story docs
  render: (args) => renderComponent(args), // rendering the component which take args as parameter
  argTypes: ARG_TYPE_OBJECT, // arguments which have to be pass in the component
} as Meta<typeof YOUR_COMPONENT>;
```

Create a method as a callback which return an HTML Element with the component inside it, it also work for typescript component as well

```js
// callback method where it takes args as parameter, and return html elment
const renderComponent = (args) => {
    return <your-html-element></your-html-element>
}
```

Now create a specific story for the component

```js
export const SecureBiometricInterfaceStory = {
  args: ARGS_OBJECT, // passing all necessary inputs
};
```

similarly if you have typescript component then you can add this

```js
type Story = StoryObj<typeof YOUR_COMPONENT>;
export const SignInWithEsignetStory: Story = {
  args: ARGS_OBJECT, // passing all necessary inputs
};
```


## Storybook Example Setup

```cmd
npx storybook@latest init -t web_components
```

after that select `webpack 5` as a builder for your project


### Typescript

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


