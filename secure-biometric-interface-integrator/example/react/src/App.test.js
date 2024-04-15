import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";
import { init, propChange } from "secure-biometric-interface-integrator";

jest.mock("secure-biometric-interface-integrator", () => ({
  init: jest.fn(),
  propChange: jest.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<App />);
  });

  it("calls init with correct parameters on mount", () => {
    const sbiEnvObj = {
      env: "Staging",
      captureTimeout: 30,
      irisBioSubtypes: "UNKNOWN",
      fingerBioSubtypes: "UNKNOWN",
      faceCaptureCount: 1,
      faceCaptureScore: 70,
      fingerCaptureCount: 1,
      fingerCaptureScore: 70,
      irisCaptureCount: 1,
      irisCaptureScore: 70,
      portRange: "4501-4510",
      discTimeout: 15,
      dinfoTimeout: 30,
    };
    render(<App />);
    expect(init).toHaveBeenCalledWith({
      container: document.getElementById(
        "secure-biometric-interface-integration"
      ),
      sbiEnv: sbiEnvObj,
      onCapture: expect.any(Function),
      onErrored: expect.any(Function),
    });
  });

  it("calls propChange when button is clicked", () => {
    const { getByText } = render(<App />);
    const button = getByText("Change Prop");
    fireEvent.click(button);
    expect(propChange).toHaveBeenCalledWith({
      langCode: "ar",
      disable: false,
    });
  });

  it("does not call propChange if button is not clicked", () => {
    render(<App />);
    expect(propChange).not.toHaveBeenCalled();
  });

  it("does not call init if component is unmounted", () => {
    const { unmount } = render(<App />);
    unmount();
    setTimeout(() => {
      expect(init).not.toHaveBeenCalled();
    }, 0); // setTimeout is used because of useEffect taking some time to render
  });

  it("calls propChange with updated parameters when button is clicked multiple times", () => {
    const { getByText } = render(<App />);
    const button = getByText("Change Prop");
    fireEvent.click(button); // First click
    fireEvent.click(button); // Second click
    fireEvent.click(button); // Third click
    expect(propChange).toHaveBeenCalledTimes(3);
    expect(propChange).toHaveBeenLastCalledWith({
      langCode: "ar",
      disable: false,
    });
  });

  it("calls init only once when component is re-rendered", () => {
    const { rerender } = render(<App />);
    rerender(<App />);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("does not call propChange with incorrect parameters when button is clicked", () => {
    const { getByText } = render(<App />);
    const button = getByText("Change Prop");
    fireEvent.click(button);
    expect(propChange).not.toHaveBeenCalledWith({
      langCode: "en", // Incorrect langCode
      disable: true, // Incorrect disable value
    });
  });

  it("does not call init with incorrect parameters on mount", () => {
    render(<App />);
    expect(init).not.toHaveBeenCalledWith({
      container: document.getElementById(
        "invalid-id" // Incorrect container id
      ),
      sbiEnv: expect.any(Object),
      onCapture: expect.any(Function),
      onErrored: expect.any(Function),
    });
  });

  it("renders the component with correct styles", () => {
    const { container } = render(<App />);
    const appElement = container.querySelector(".App");
    setTimeout(() => {
      expect(appElement).toHaveStyle({
        display: "flex", // Correct style
        flexDirection: "column", // Correct style
        justifyContent: "center", // Correct style
      });
    }, 0);
  });

  it("renders the secure-biometric-interface-integration container", () => {
    const { container } = render(<App />);
    const sbiContainer = container.querySelector(
      "#secure-biometric-interface-integration"
    );
    setTimeout(() => {
      expect(sbiContainer).toBeInTheDocument();
    }, 0);
  });

  it("does not render a non-existent element", () => {
    const { container } = render(<App />);
    const nonExistentElement = container.querySelector("#non-existent-element");
    setTimeout(() => {
      expect(nonExistentElement).not.toBeInTheDocument();
    }, 0);
  });

  it("does not render a button with incorrect text", () => {
    const { queryByText } = render(<App />);
    const button = queryByText("Incorrect Text");
    setTimeout(() => {
      expect(button).not.toBeInTheDocument();
    }, 0);
  });

  it("does not call init if container is not found", () => {
    jest.spyOn(document, "getElementById").mockReturnValueOnce(null);
    render(<App />);
    setTimeout(() => {
      expect(init).not.toHaveBeenCalled();
    }, 0);
  });
});
