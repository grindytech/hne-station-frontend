import { ToastPosition } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";
import React from "react";

interface ConfigDefault {
  isClosable: boolean;
  position: ToastPosition;
}

interface CustomToast {
  success: (description: string | React.ReactNode) => void;
  error: (description: string | React.ReactNode) => void;
  warning: (description: string | React.ReactNode) => void;
  info: (description: string | React.ReactNode) => void;
}

const useCustomToast = (): CustomToast => {
  const toast = createStandaloneToast();
  const configDefault: ConfigDefault = {
    isClosable: true,
    position: "top-right",
  };
  function success(description: string | React.ReactNode) {
    toast({ status: "success", description, ...configDefault });
  }
  function error(description: string | React.ReactNode) {
    toast({ status: "error", description, ...configDefault });
  }
  function warning(description: string | React.ReactNode) {
    toast({ status: "warning", description, ...configDefault });
  }
  function info(description: string | React.ReactNode) {
    toast({ status: "info", description, ...configDefault });
  }
  return { success, error, warning, info };
};

export default useCustomToast;
