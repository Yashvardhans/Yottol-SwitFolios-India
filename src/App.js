import OriginalResearch1 from "./components/OriginalResearch1/OriginalResearch1";
import OriginalResearch2 from "./components/OriginalResearch2/OriginalResearch2";
import SwiftFoliosResearchForm from "./components/SwiftFoliosResearchForm/SwiftFoliosResearchForm";
import CustomDropdown from "./components/CustomComponents/CustomDropdown/CustomDropdown";
import "./App.css";

function App() {
  const fundData = [
    {
      name: "RELIANCE",
      price: "1,452.32",
      value_change: "145.36",
      perc_change: "9.62%",
      header:
        "The world in bitcoins. Implications on dollar losing the reserve currency",
      text: "The fund aims to track the performance of the 1OAK MA80 Strategy, which has a benchmark allocation of approximately 80% in Equities with 20% in Bonds and Alternatives.. The strategy has exposure to equities, fixed income, cash and alternative assets.",
      file: "",
      video: "",
      date:"3rd of December 2021"
    },
    {
      name: "RELIANCE",
      price: "1,452.32",
      value_change: "145.36",
      perc_change: "9.62%",
      header:
        "The world in bitcoins. Implications on dollar losing the reserve currency",
      text: "The fund aims to track the performance of the 1OAK MA80 Strategy, which has a benchmark allocation of approximately 80% in Equities with 20% in Bonds and Alternatives.. The strategy has exposure to equities, fixed income, cash and alternative assets.",
      file: "",
      video: "",
      date:"3rd of December 2021"
    },
    {
      name: "RELIANCE",
      price: "1,452.32",
      value_change: "145.36",
      perc_change: "9.62%",
      header:
        "The world in bitcoins. Implications on dollar losing the reserve currency",
      text: "The fund aims to track the performance of the 1OAK MA80 Strategy, which has a benchmark allocation of approximately 80% in Equities with 20% in Bonds and Alternatives.. The strategy has exposure to equities, fixed income, cash and alternative assets.",
      file: "",
      video: "video1.mp4",
      date:"3rd of December 2021"
    },
  ];
  return (
    <div className="App">
      <SwiftFoliosResearchForm/>
      <OriginalResearch1 />
      <OriginalResearch2 fundData={fundData} />
    </div>
  );
}

export default App;
