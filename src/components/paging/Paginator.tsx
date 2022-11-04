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
  const [currentPage, setCurrentPage] = useState(page);
  return totalPage > 1 ? (
    <HStack>
      <Button
        disabled={page <= 1}
        onClick={() => {
          const iPage = currentPage;
          if (iPage > 1) {
            const newPage = iPage - 1;
            setInputPage(String(newPage));
            setCurrentPage(newPage);
            onChange(newPage);
          }
        }}
        size="sm"
      >
        <Icon as={FiChevronLeft}></Icon>
      </Button>
      {/* <Input
        borderRadius={10}
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
        placeholder={String(currentPage)}
        onChange={(e) => {
          setInputPage(e.target.value);
        }}
      ></Input> */}
      <Text size="sm">
        {currentPage} of {totalPage}
      </Text>
      <Button
        onClick={() => {
          if (page < totalPage) {
            const iPage = currentPage;
            if (iPage < totalPage) {
              const newPage = iPage + 1;
              setInputPage(String(newPage));
              setCurrentPage(newPage);
              onChange(newPage);
            }
          }
        }}
        size="sm"
        disabled={page >= totalPage}
      >
        <Icon as={FiChevronRight}></Icon>
      </Button>
    </HStack>
  ) : (
    <></>
  );
}
