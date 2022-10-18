import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/theme-tools";

const Card: ComponentStyleConfig = {
  baseStyle: {
    p: "22px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    minWidth: "0px",
    wordWrap: "break-word",
    backgroundClip: "border-box",
  },
  variants: {
    panel: (props: StyleFunctionProps) => ({
      bg: props.colorMode === "dark" ? "gray.700" : "white",
      width: "100%",
      boxShadow: "0px 3.5px 5.5px rgba(0, 0, 0, 0.02)",
      borderRadius: "10px",
    }),
  },
  defaultProps: {
    variant: "panel",
  },
};

const CardBody: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    width: "100%",
  },
};

const CardHeader: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    width: "100%",
  },
};
const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: 25,
  },
};
const Input: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: 25,
  },
};
const ModalCloseButton: ComponentStyleConfig = {
  defaultProps: {
    _focus: {
      border: "none",
    },
  },
};
export const theme = extendTheme({
  styles: {
    global: {
      "#root": {
        position: "relative",
        minHeight: "100vh",
        // background: "#F1F1F1",
      },
      a: {
        color: "#7CC29A",
      },
      ".recharts-cartesian-axis-tick-value": {
        fontSize: "12px",
        fill: "#4BA170",
        fontFamily: "var(--chakra-fonts-body)",
      },
      ".recharts-default-tooltip": {
        boxShadow: "0px 3.5px 5.5px rgba(0, 0, 0, 0.02)",
        borderRadius: "10px",
        fontFamily: "var(--chakra-fonts-body)",
        backgroundColor: "white",
        border: "none",
        ".recharts-tooltip-label": {
          color: "#2C5F42",
        },
      },
    },
  },
  colors: {
    primary: {
      "50": "#A5D5BA",
      "100": "#97CFB0",
      "200": "#7CC29A",
      "300": "#60B585",
      "400": "#4BA170",
      "500": "#3E855D",
      "600": "#2C5F42",
      "700": "#1A3827",
      "800": "#08120D",
      "900": "#000000",
    },
  },
  components: {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    ModalCloseButton,
    Link: {
      variants: {
        "no-underline": {
          _hover: {
            textDecoration: "none",
          },
          height: 10,
          minWidth: 10,
          paddingInlineStart: 4,
          paddingInlineEnd: 4,
          display: "inline-flex",
          alignItems: "center",
        },
      },
    },
  },
});
