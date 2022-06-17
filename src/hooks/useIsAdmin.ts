import { isAdmin } from "contracts/governance";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";

const useIsAdmin = (options?: { enabled?: boolean; key: string }) => {
  const { enabled = true, key = "useIsAdmin" } = options || {};
  const { account } = useWallet();
  const { data: admin = false, isLoading: adminLoading } = useQuery(
    ["getIsAdmin", key],
    async () => (account ? isAdmin(account) : false),
    {
      enabled,
    }
  );
  return {
    admin,
    adminLoading,
  };
};

export { useIsAdmin };
