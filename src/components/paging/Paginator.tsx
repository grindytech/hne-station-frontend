import { Button, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Paginator({
  page,
  totalPage,
  onChange,
}: {
  page: number;
  totalPage: number;
  onChange: (page: number) => void;
}) {
  const [inputPage, setInputPage] = useState(page);
  return totalPage > 1 ? (
    <HStack>
      <Button
        disabled={inputPage <= totalPage}
        onClick={() => {
          if (inputPage > 1) {
            const newPage = inputPage - 1;
            setInputPage(newPage);
            onChange(newPage);
          }
        }}
        size="sm"
        colorScheme="primary"
      >
        <Icon as={FiChevronLeft}></Icon>
      </Button>
      <Input
        // disabled={inputPage === totalPage}
        borderRadius={25}
        size="sm"
        width={"14"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(inputPage);
          }
        }}
        value={inputPage}
        onChange={(e) => {
          const p = Number(e.target.value);
          if (!isNaN(p) && p > 0 && p <= totalPage) {
            setInputPage(p);
          }
        }}
      ></Input>
      <Text size="sm">of {totalPage}</Text>
      <Button
        onClick={() => {
          if (inputPage < totalPage) {
            const newPage = inputPage + 1;
            setInputPage(newPage);
            onChange(newPage);
          }
        }}
        size="sm"
        colorScheme="primary"
        disabled={inputPage >= totalPage}
      >
        <Icon as={FiChevronRight}></Icon>
      </Button>
    </HStack>
  ) : (
    <></>
  );
}
