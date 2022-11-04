import { TxInfo } from "components/bridge/dashboard/PendingTxButton";
import useCustomToast from "hooks/useCustomToast";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import bridgeService from "services/bridge.service";

export type TXStatus =
  | "confirming"
  | "pending"
  | "success"
  | "fail"
  | "rejected";
export type Transaction = {
  nonce: string;
  txHash: string;
  txHashTo?: string;
  type: "swap" | "approve" | "bridge";
  status: TXStatus;
  token1: string;
  token2: string;
  amount: number;
  chainFrom: string;
  chainTo: string;
  msg?: string;
  time: number;
};
const STORAGE_KEY = "SessionTxContext_transactions";
const SessionTxContext = React.createContext<{
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  add: (tx: Transaction) => void;
  get: (txHash: string) => Transaction | undefined;
  update: (nonce: string, tx: Transaction) => void;
}>({
  transactions: [],
  pendingTransactions: [],
  add: () => {},
  get: (txHash: string) => undefined,
  update: (nonce: string, tx: Transaction) => {},
});
function useSessionTx() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const toast = useCustomToast();
  const pendingTransactions = useMemo(
    () =>
      transactions.filter(
        (tx) => tx.status === "pending" || tx.status === "confirming"
      ),
    [transactions]
  );
  const add = (tx: Transaction) => {
    const localTxs = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Transaction[];
    setTransactions([
      ...localTxs.filter(
        (t) => (!t.txHash || t.txHash !== tx.txHash) && t.nonce !== tx.nonce
      ),
      tx,
    ]);
  };
  const get = useCallback(
    (txHash: string) => transactions.find((tx) => tx.txHash === txHash),
    [transactions]
  );
  const update = (nonce: string, updateTx: Transaction) => {
    const localTxs = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Transaction[];
    const newTransactions = localTxs.map((tx) => {
      let newTx = tx;
      if (tx.nonce === nonce) {
        newTx = updateTx;
      }
      return newTx;
    });
    setTransactions(newTransactions);
  };

  const refreshStatus = useCallback(async () => {
    const pendingTxs = pendingTransactions.filter(
      (tx) => tx.status === "pending" && tx.type === "bridge"
    );
    if (pendingTxs.length === 0) return;
    await Promise.all(
      pendingTxs.map((tx) =>
        (async () => {
          const rsp = await bridgeService.getTransfer({
            txHash: tx.txHash,
          });
          if (rsp.total > 0) {
            debugger;
            tx.status = "success";
            update(tx.nonce, tx);
            toast.success(<TxInfo title="Transaction successfully" tx={tx} />);
          }
        })()
      )
    );
  }, [toast, pendingTransactions]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStatus();
    }, 15000);
    return () => {
      clearInterval(interval);
    };
  }, [refreshStatus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  return {
    transactions,
    add,
    get,
    update,
    pendingTransactions,
  };
}

const SessionTxProvider: React.FC<Record<string, unknown>> = (props) => {
  const { children } = props;
  const context = useSessionTx();
  return (
    <>
      <SessionTxContext.Provider value={context}>
        {children}
      </SessionTxContext.Provider>
    </>
  );
};

const useSessionTxHistories = () => {
  const context = useContext(SessionTxContext);
  return context;
};
export { useSessionTxHistories, SessionTxProvider };
