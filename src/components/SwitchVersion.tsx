import { Box, Button, CSSObject } from "@chakra-ui/react";

const SwitchVersion: React.FC<{ isV2?: boolean; onClick: () => void }> = ({
  isV2 = true,
  onClick,
}) => {
  return (
    <Box sx={{ borderRadius: "full", border: "1px", borderColor: "primary" }}>
      <Button
        onClick={!isV2 ? onClick : () => {}}
        size="sm"
        sx={isV2 ? { ...btnActive, ...btn } : { ...btnInActive, ...btn }}
      >
        V2
      </Button>
      <Button
        onClick={isV2 ? onClick : () => {}}
        size="sm"
        sx={!isV2 ? { ...btnActive, ...btn } : { ...btnInActive, ...btn }}
      >
        V1
      </Button>
    </Box>
  );
};
const btn: CSSObject = {
  borderRadius: "full",
  _hover: "none",
  _focus: "none",
  _active: "none",
};
const btnInActive: CSSObject = {
  color: "gray",
  background: "none",
};
const btnActive: CSSObject = {
  color: "white",
  background: "primary",
  transform: "scale(1.2)",
};

export default SwitchVersion;
