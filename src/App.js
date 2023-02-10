import { Routes, Route} from "react-router-dom";
import WidgetMain from "./widget/WidgetMain";


function App() {
  return (
    <Routes>
          <Route path="/widget" element={<WidgetMain/> }  />

    </Routes>
  );
}

export default App;
