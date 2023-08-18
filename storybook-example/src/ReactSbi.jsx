import { MosipBioDevice } from "../../mosip-bio-device/src/index";

function ReactSbi(args) {
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
          padding: "50px"
        }}
      >
        <MosipBioDevice {...args} />
      </div>
    </div>
  );
}

export default ReactSbi;
