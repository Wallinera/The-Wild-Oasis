import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";
import logoLight from "../data/img/logo-light.png";
import logoDark from "../data/img/logo-dark.png";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode ? logoDark : logoLight;

  return (
    <StyledLogo>
      <Img src={src} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
