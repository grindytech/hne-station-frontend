import {
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import { minDeposit } from "contracts/governance";
import { format, formatDistance } from "date-fns";
import { useQuery } from "react-query";
import { formatDate, numeralFormat } from "utils/utils";

export default function Deposit({
  deposited,
  endDeposit,
  loading,
}: {
  deposited: number;
  endDeposit?: Date;
  loading: boolean;
}) {
  const { data: minimumDeposit, isFetching: minDepositFetching } = useQuery(
    "minDeposit",
    async () => {
      return Number(await minDeposit()) / 1e18;
    }
  );
  return (
    <Card>
      <CardHeader>
        <Text mb={5} fontSize="lg" fontWeight="semibold" color="primary.500">
          Deposit
        </Text>
      </CardHeader>
      <CardBody>
        <VStack w="full" alignItems="center">
          <Skeleton isLoaded={!minDepositFetching}>
            <CircularProgress
              size="40"
              value={(deposited / Number(minimumDeposit)) * 100}
              color={"green.400"}
            >
              <CircularProgressLabel color="primary.500" fontWeight="bold" fontSize="2xl">
                {numeralFormat((deposited / Number(minimumDeposit)) * 100)}%
              </CircularProgressLabel>
            </CircularProgress>
          </Skeleton>
          <HStack pt={5} spacing={[8]} px={5}>
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                Deposited
              </Text>
              <Skeleton isLoaded={!loading}>
                <Text fontSize="xs" color="primary.500">
                  {numeralFormat(deposited, 4)} HE
                </Text>
              </Skeleton>
            </VStack>
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                Deposit end time
              </Text>
              <Skeleton isLoaded={!loading}>
                <Tooltip label={formatDate(endDeposit)}>
                  <Text fontSize="xs" color="primary.500">
                    {endDeposit
                      ? formatDistance(endDeposit, Date.now(), {
                          includeSeconds: false,
                          addSuffix: true,
                        })
                      : "--"}
                  </Text>
                </Tooltip>
              </Skeleton>
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
