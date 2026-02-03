import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const Main = styled.main`
  overflow-y: auto;
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  max-width: 120rem;
  margin: 0 auto;
`;

function AppLayout() {
  return (
    <Layout>
      <Sidebar />
      <Header />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </Layout>
  );
}

export default AppLayout;
