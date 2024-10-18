"use client";

import { SearchInput } from "@/components/SearchInput";
import { useCampaigns } from "@/hooks/useCampaigns";
import usePagination from "@/hooks/usePagination";
import { Campaign } from "@/templates/campaigns/campaign";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function Page() {
  const [search, setSearch] = useState("");
  const { campaigns, isLoading } = useCampaigns();

  const campaignsFilters =
    campaigns?.filter(
      (customerGroup) =>
        !search ||
        customerGroup?.name
          ?.toLocaleLowerCase()
          .trim()
          .includes(search.toLocaleLowerCase().trim())
    ) || [];

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: campaignsFilters?.length,
    perpage: 50,
  });

  const campaignsPag = campaignsFilters.slice(
    currentPage - 1,
    currentPage + 49
  );

  if (isLoading)
    return (
      <Center h={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          as={Link}
          href={"/private/campaigns/create-campaigns"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Tạo chiến dịch
        </Button>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        mt={"32px"}
        mb={"48px"}
        gap={"24px"}
      >
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"}>
            Tìm kiếm
          </Heading>
          <SearchInput onSearch={(value) => setSearch(value)} />
        </HStack>

        <HStack>
          <Text>{`${currentPage}/ ${totalPages} trang`}</Text>
          <IconButton
            rounded={"sm"}
            aria-label="prev"
            onClick={() => prevPage()}
            icon={<GrFormPrevious />}
            colorScheme="teal"
            isDisabled={currentPage <= 1}
          />
          <IconButton
            rounded={"sm"}
            aria-label="next"
            onClick={() => nextPage()}
            icon={<GrFormNext />}
            colorScheme="teal"
            isDisabled={currentPage >= totalPages}
          />
        </HStack>
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6, "2xl": 7 }}
        gap={"18px"}
        color={"gray.400"}
      >
        {campaignsPag?.map((campaign, index) => (
          <Campaign campaign={campaign} key={index} />
        ))}
      </SimpleGrid>
    </>
  );
}
