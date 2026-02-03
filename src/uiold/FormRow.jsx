import styled from "styled-components";

function FormRow({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error.message}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
