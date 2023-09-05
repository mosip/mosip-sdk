import SignInWithEsignet from "../../react-sign-in-with-esignet/src/lib/SignInWithEsignet/SignInWithEsignet";

function ReactSignInWithEsignet(args) {
  return (
    <div
      style={{
        width: "100%",
        background: "#f6f6f2",
      }}
    >
      <div
        style={{
          margin: "auto",
          width: "50%",
          border: "3px solid #d8d8d8",
          padding: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <SignInWithEsignet {...args} />
      </div>
    </div>
  );
}

export default ReactSignInWithEsignet;
