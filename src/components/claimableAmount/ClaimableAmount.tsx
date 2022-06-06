import { HStack, VStack, Icon, Button, Text, Skeleton } from '@chakra-ui/react'
import Card from 'components/card/Card'
import CardHeader from 'components/card/CardHeader'
import { getClaimableAmount } from 'contracts/claim'
import React from 'react'
import { useQuery } from 'react-query'
import { useWallet } from 'use-wallet'
import { formatNumber } from 'utils/utils'
import { ReactComponent as HEIcon } from "assets/he_coin.svg";

export const getClaimableAmountQueryKey = "getClaimableAmount";

interface IProps {
  isLoading: boolean;
  claimableAmount: number;
}

const ClaimableAmount: React.FC<IProps> = ({isLoading, claimableAmount}) => {
  const { isConnected } = useWallet();

  return (
    <VStack flex={1} alignItems="flex-start">
      <Text fontWeight="semibold" color="gray.500" fontSize="sm">
        Claimable Amount
      </Text>
      <Skeleton isLoaded={!isLoading}>
        {isConnected() ? (
          <HStack w="100%" justifyContent="space-between">
            <VStack alignItems="flex-start">
              <HStack>
                <Icon w="24px" h="24px">
                  <HEIcon />
                </Icon>
                <Text fontWeight="bold" fontSize="2xl">{formatNumber(claimableAmount)}</Text>
              </HStack>
            </VStack>
          </HStack>) : ("--")}
      </Skeleton>
    </VStack>
  )
}

export default ClaimableAmount