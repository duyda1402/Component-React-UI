import { Container } from "@mantine/core";
import SummaryComponent from "./components/Summary";

function App() {
  return (
    <Container py="md" w={600}>
      <SummaryComponent />
    </Container>
  );
}

export default App;
