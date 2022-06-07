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

export const theme = extendTheme({
  styles: {
    global: {
      "#root": {
        position: "relative",
        minHeight: "100vh",
        // background: "#F1F1F1",
      },
    },
  },
  colors: {
    primary: {
      "50": "#F8E4F6",
      "100": "#F2CCF0",
      "200": "#E29CE5",
      "300": "#CB6CD8",
      "400": "#AE3BCB",
      "500": "#7E2A9F",
      "600": "#602383",
      "700": "#451B66",
      "800": "#2D144A",
      "900": "#190C2E",
    },
  },
  components: {
    Card,
    CardBody,
    CardHeader,
    
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
