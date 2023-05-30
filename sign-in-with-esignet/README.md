# sign-in-with-esignet

Renders a button that will navigate the user to esignet website for authentication. Follows Open Id connect protocol.

## Installation

```
# using npm
npm i sign-in-with-esignet

# using yarn
yarn add sign-in-with-esignet
```

## Props

| prop           | type          | default value | note                             |
| -------------- | ------------- | ------------- | -------------------------------- |
| `oidcConfig`   | `Json Object` |               | Open Id connect configurations   |
| `buttonConfig` | `Json Object` |               | Configuration for sign in button |

### Prop `oidcConfig`

| field            | type     | required    | default value | note                                                                                                                                                                                                                         |
| ---------------- | -------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorizeUri`   | `string` | Yes         |               | The authorize URI on the authorization server is where an OpenID Connect flow starts.                                                                                                                                        |
| `redirect_uri`   | `string` | Yes         |               | The redirect URI tells the issuer where to redirect the browser back to when the flow is done.                                                                                                                               |
| `client_id`      | `string` | Yes         |               | Every client (website or mobile app) is identified by a client ID. The client ID is a public value that does not have to be protected.                                                                                       |
| `scope`          | `string` | Yes         |               | Clients can request additional information or permissions via scopes. The openid scope is the only required scope.                                                                                                           |
| `response_type`  | `string` | No          | `code`        | The authorization server will respond with a code, which the client can exchange for tokens on a secure channel.                                                                                                             |
| `nonce`          | `string` | No          |               | A nonce (or number used once) is a random value that is used to prevent replay attacks.                                                                                                                                      |
| `state`          | `string` | Recommanded |               | The state is an optional value that is carried through the whole flow and returned to the client. Random value will be created if not provided.                                                                              |
| `acr_values`     | `string` | No          |               | Requested Authentication Context Class Reference values                                                                                                                                                                      |
| `claims`         | `string` | No          |               | The Client can obtain Claims about the End-User and the Authentication event. For more detail check [Claims](https://openid.net/specs/openid-connect-core-1_0.html#Claims).                                                  |
| `claims_locales` | `string` | No          |               | End-User's preferred languages and scripts for Claims being returned.                                                                                                                                                        |
| `ui_locales`     | `string` | No          |               | End-User's preferred languages and scripts for the user interface                                                                                                                                                            |
| `display`        | `string` | No          |               | ASCII string value that specifies how the Authorization Server displays the authentication and consent user interface pages to the end user. Allowed values: `page` `popup` `touch` `wap`                                    |
| `max_age`        | `string` | No          |               | Maximum Authentication Age. This specifies the allowable elapsed time in seconds since the last time the end user was actively authenticated by the OP.                                                                      |
| `prompt`         | `string` | No          |               | Space delimited case-sensitive list of ASCII string values that specifies whether the Authorization Server prompts the End-User for re-authentication and consent. Allowed values: `none` `login` `consent` `select_account` |

### Prop `buttonConfig`

| field         | type     | valid values                                         | default value          | note                                       |
| ------------- | -------- | ---------------------------------------------------- | ---------------------- | ------------------------------------------ |
| `type`        | `string` | (“standard”, “icon”)                                 | "standard"             | The button type: icon, or standard button. |
| `theme`       | `string` | (“outline”, “filled_blue”, “filled_black”, “custom”) | “outline”              | The button theme.                          |
| `shape`       | `string` | (“sharp_edges”, “soft_edges”, “rounded_edges”)       | “sharp_edges”          | The button shape.                          |
| `labelText`   | `string` |                                                      | “Sign in with Esignet” | The button text.                           |
| `logoPath`    | `string` |                                                      | esignet logo           | Path to the id provider’s logo             |
| `width`       | `number` |                                                      | 400px                  | The button width, in pixels                |
| `background`  | `string` |                                                      |                        | Background property of esignet button      |
| `textColor`   | `string` |                                                      |                        | Color of label text                        |
| `borderColor` | `string` |                                                      |                        | Border color of esignet button             |
| `borderWidth` | `string` |                                                      |                        | Border width of esignet button             |
| `font`        | `string` |                                                      |                        | font of the label text                     |
| `fontFamily`  | `string` |                                                      |                        | font family of the label text              |
| `customStyle` | `string` |                                                      |                        | Custom styling option                      |

## Usage

```js
# using import
import { SignInWithEsignet } from "sign-in-with-esignet";
```

## Example

React JS

```js
//configuration for Open id connect
useEffect(() => {
  SignInWithEsignet({
    oidcConfig: {
      authorizeUri: "https://esignet.dev.mosip.net/authorize",
      redirect_uri: "https://healthservices.dev.mosip.net/userprofile",
      client_id: "88Vjt34c5Twz1oJ",
      scope: "openid profile",
    },
    buttonConfig: {
      shape: "soft_edges",
      theme: "filled_orange",
    },
    signInElement: document.getElementById("sign-in-with-esignet"),
  });
}, []);


export default function MyComponent() {

return (
      <div id="sign-in-with-esignet"></div>
  );
}

/>;
```

HTML

```HTML

<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { SignInWithEsignet } from "<signin button JS url>";
      window.onload = function () {
        SignInWithEsignet({
          oidcConfig: {
            authorizeUri: "https://esignet.dev.mosip.net/authorize",
            redirect_uri: "https://healthservices.dev.mosip.net/userprofile",
            client_id: "88Vjt34c5Twz1oJ",
            scope: "openid profile",
          },
          buttonConfig: {
            shape: "soft_edges",
            theme: "filled_orange",
          },
          signInElement: document.getElementById("sign-in-with-esignet"),
        });
      };
    </script>
    <div id="sign-in-with-esignet"></div>
  </body>
</html>

/>;
```
