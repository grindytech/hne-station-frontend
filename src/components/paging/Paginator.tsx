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
  const [inputPage, setInputPage] = useState<string>(String(page));
  return totalPage > 1 ? (
    <HStack>
      <Button
        disabled={page <= 1}
        onClick={() => {
          const iPage = Number(inputPage);
          if (iPage > 1) {
            const newPage = iPage - 1;
            setInputPage(String(newPage));
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
            const p = Number(inputPage);
            if (!isNaN(p) && p >= 0 && p <= totalPage) {
              onChange(p);
            }
          }
        }}
        placeholder={String(inputPage)}
        onChange={(e) => {
          setInputPage(e.target.value);
        }}
      ></Input>
      <Text size="sm">of {totalPage}</Text>
      <Button
        onClick={() => {
          if (page < totalPage) {
            const iPage = Number(inputPage);
            if (iPage < totalPage) {
              const newPage = iPage + 1;
              setInputPage(String(newPage));
              onChange(newPage);
            }
          }
        }}
        size="sm"
        colorScheme="primary"
        disabled={page >= totalPage}
      >
        <Icon as={FiChevronRight}></Icon>
      </Button>
    </HStack>
  ) : (
    <></>
  );
}
