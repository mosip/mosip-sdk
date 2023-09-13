import init from "./SignInWithEsignet";

describe(
  "init", () => {
    const oidcConfig = {
      authorizeUri: "https://example.com/authorize",
      redirect_uri: "https://example.com/callback",
      client_id: "client123",
      scope: "openid"
    };

    const buttonConfig = {
      theme: "outline",
      shape: "sharp_edges",
      width: '150px',
      background: '#3498db', // Background color of the button (CSS style)
      textColor: '#ffffff',
      borderColor: '#2980b9', // Border color of the button (CSS style)
      borderWidth: '2px', // Border width of the button (CSS style)
      font: '16px Arial', // Font style for the button (CSS style)
      fontFamily: 'Arial, sans-serif',
    }

    const signInElement = document.createElement('div');

    const style = {
      backgroundColor: 'red',
    };

    beforeEach(() => {
        signInElement.innerHTML = '';
    });

    it("should return 'Required parameter is missing' when required parameters are missing", () => {
      const invalidOidcConfig = {
        authorizeUri: "https://example.com/authorize",
        redirect_uri: "https://example.com/callback",
        client_id: "client123",
        scope: ""
      };
      init({ oidcConfig: invalidOidcConfig, buttonConfig, signInElement, style });
      const errorElement = signInElement.querySelector('span');
      expect(errorElement?.textContent).toContain('Required parameter is missing');
    });

    it("should return 'Invalid Response Type' when response_type is invalid", () => {
      const oidcConfig = {
        response_type: "invalid",
        authorizeUri: "https://example.com/authorize",
        redirect_uri: "https://example.com/callback",
        client_id: "client123",
        scope: "openid",
      };
      init({ oidcConfig, buttonConfig, signInElement, style });
      const errorElement = signInElement.querySelector('span');
      expect(errorElement?.textContent).toContain("Invalid Response Type");
    });

    it("should return 'Invalid display value' when display is invalid", () => {
      const oidcConfig = {
        display: "invalid",
        authorizeUri: "https://example.com/authorize",
        redirect_uri: "https://example.com/callback",
        client_id: "client123",
        scope: "openid",
      };
      init({ oidcConfig, buttonConfig, signInElement, style });
      const errorElement = signInElement.querySelector('span');
      expect(errorElement?.textContent).toContain("Invalid display value");
    });

    it("should return 'Invalid prompt value' when prompt is invalid", () => {
      const oidcConfig = {
        prompt: "invalid",
        authorizeUri: "https://example.com/authorize",
        redirect_uri: "https://example.com/callback",
        client_id: "client123",
        scope: "openid",
      };
      init({ oidcConfig, buttonConfig, signInElement, style });
      const errorElement = signInElement.querySelector('span');
      expect(errorElement?.textContent).toContain("Invalid prompt value");
    });

    it("should return an empty string when all parameters are valid", () => {
      const oidcConfig = {
        authorizeUri: "https://example.com/authorize",
        redirect_uri: "https://example.com/callback",
        client_id: "client123",
        scope: "openid",
      };
      init({ oidcConfig, buttonConfig, signInElement, style });
      const errorElement = signInElement.querySelector('span');
      expect(errorElement?.textContent).toContain("");
    });

    it('should correctly build the URL with required parameters', () => {
      const oidcConfig = {
        authorizeUri: 'https://example.com/auth',
        nonce: 'some_nonce',
        state: 'some_state',
        client_id: 'your-client-id',
        redirect_uri: 'https://example.com/callback',
        scope: 'openid profile',
        response_type: 'code',
        acr_values: 'acr_values',
        claims: { claim1: 'value1', claim2: 'value2' },
        claims_locales: 'en-US',
        display: 'popup',
        prompt: 'consent',
        max_age: 3600,
        ui_locales: 'en-US',
      };

      signInElement.id = 'sign-in-button'; 

      init({ oidcConfig, buttonConfig, signInElement, style});
      const anchorElement = signInElement.querySelector('a');
      const url = anchorElement?.href;

      const expectedURL = 'https://example.com/auth?nonce=some_nonce&state=some_state&client_id=your-client-id&redirect_uri=https://example.com/callback&scope=openid%20profile&response_type=code&acr_values=acr_values&claims=%7B%22claim1%22:%22value1%22,%22claim2%22:%22value2%22%7D&claims_locales=en-US&display=popup&prompt=consent&max_age=3600&ui_locales=en-US';

      expect(url).toEqual(expectedURL);
    });

});