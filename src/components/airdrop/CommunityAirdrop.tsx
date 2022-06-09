import { Button, HStack, Link, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import * as airdropContract from "contracts/communityAirdrop";
import { safeAmount } from "contracts/contracts";
import { format } from "date-fns";
import useCustomToast from "hooks/useCustomToast";
import { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useWallet } from "use-wallet";
import { formatNumber } from "utils/utils";

export default function CommunityAirdrop({
  name,
  section,
  total,
  linkWhiteList,
}: {
  name: string;
  section: string;
  total: number;
  linkWhiteList: string;
}) {
  const wallet = useWallet();
  const [startAt, setStartAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [inWhitelist, setInWhitelist] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const tost = useCustomToast();
  const fetchData = useCallback(async () => {
    const startTime = await airdropContract.start(section);
    setStartAt(Number(startTime) * 1e3);

    const account = wallet.account;
    if (!account) return;
    setInWhitelist(Boolean(await airdropContract.whitelistAddress(section, account)));
    setIsClaimed(Boolean(await airdropContract.claimed(section, account)));
    const claimAble = await airdropContract.airdropAmount(section, account);
    setAmount(Number(claimAble) ? safeAmount({ str: claimAble }) : 0);
  }, [wallet]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (startAt > now) {
      const countInterval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
      return () => {
        clearInterval(countInterval);
      };
    }
  }, [startAt]);
  async function claimAirdrop() {
    try {
      setLoading(true);
      await airdropContract.claim(section, wallet.account as any);
    } catch (error) {
      console.error(error);
      tost.error("Transaction fail!");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Card mt={[10, 5]} mr={[10, 5]} flex={{ lg: 1 }} maxW="300px">
        <VStack alignItems="flex-start">
          <Text fontWeight="bold" fontSize="xl" color="primary.500">
            {/* Community Airdrop */}
            {name}
          </Text>
          <HStack w="100%" justifyContent="space-between">
            <Text fontWeight="semibold" color="gray.500" fontSize="sm">
              Amount
            </Text>
            <Text color="gray.500" fontSize="sm">
              {amount ? formatNumber(amount) : "--"} HE
            </Text>
          </HStack>
          <HStack w="100%" justifyContent="space-between">
            <Text fontWeight="semibold" color="gray.500" fontSize="sm">
              Total
            </Text>
            <Text color="gray.500" fontSize="sm">
              {total ? formatNumber(total) : "--"} HE
            </Text>
          </HStack>
          <HStack w="100%" justifyContent="space-between">
            <Text fontWeight="semibold" color="gray.500" fontSize="sm">
              Start at
            </Text>
            <Text color="gray.500" fontSize="sm">
              {startAt ? format(startAt, "yyy/MM/dd HH:mm") : "--"}
            </Text>
          </HStack>
          {wallet.account && (
            <HStack w="100%" pt={2} justifyContent="center">
              {now < startAt ? (
                <Countdown date={startAt} daysInHours />
              ) : !inWhitelist ? (
                <Text color="primary.200" fontSize="sm">
                  Your address is not in{" "}
                  <Link colorScheme="primary" target="_blank" href={linkWhiteList ?? "#"}>
                    whitelist
                  </Link>
                </Text>
              ) : isClaimed ? (
                <Button size="sm" disabled>
                  Claimed
                </Button>
              ) : (
                <Button onClick={claimAirdrop} isLoading={loading} size="sm" colorScheme="primary">
                  Claim
                </Button>
              )}
            </HStack>
          )}
        </VStack>
      </Card>
    </>
  );
}
