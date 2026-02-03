import styled from "styled-components";

const SIZES = {
  small: {
    "--fontSize": "1.2rem",
    "--padding": "0.4rem 0.8rem",
    "--fontWeight": 600,
    "--textTransform": "uppercase",
  },
  medium: {
    "--fontSize": "1.4rem",
    "--padding": "1.2rem 1.6rem",
    "--fontWeight": 500,
    "--textTransform": "none",
  },
  large: {
    "--fontSize": "1.6rem",
    "--padding": "1.2rem 2.4rem",
    "--fontWeight": 500,
    "--textTransform": "none",
  },
};

function Button({ variant = "primary", size = "medium", children, ...props }) {
  const styles = SIZES[size];

  let Component;
  if (variant === "danger") {
    Component = DangerButton;
  } else if (variant === "secondary") {
    Component = SecondaryButton;
  } else {
    Component = PrimaryButton;
  }

  return (
    <Component style={styles} {...props}>
      {children}
    </Component>
  );
}

const ButtonBase = styled.button`
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  border: none;
  font-size: var(--fontSize);
  font-weight: var(--fontWeight);
  padding: var(--padding);
  text-transform: var(--textTransform);
  text-align: center;
`;

const PrimaryButton = styled(ButtonBase)`
  color: var(--color-brand-50);
  background-color: var(--color-brand-600);

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  color: var(--color-grey-600);
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const DangerButton = styled(ButtonBase)`
  color: var(--color-red-100);
  background-color: var(--color-red-700);

  &:hover {
    background-color: var(--color-red-800);
  }
`;

export default Button;
