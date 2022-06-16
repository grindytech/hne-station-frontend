import { Heading, HStack, Stack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";

export default function HomePage() {
  return (
    <Stack spacing={[10, 5]} direction={["column", "row"]} w="100%" mt={[10, 5]}>
      <Card>
        <CardHeader>Total Supply</CardHeader>
        <CardBody>1.0B HE </CardBody>
      </Card>
      <Card>
        <CardHeader>Circulating Supply</CardHeader>
        <CardBody>1.0B HE </CardBody>
      </Card>
      <Card>
        <CardHeader>Total Stacking</CardHeader>
        <CardBody>1.0B HE </CardBody>
      </Card>
    </Stack>
  );
}
