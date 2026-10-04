"use client";

import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  Heading,
  Portal,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { memo, useState } from "react";
import { IconButton } from "@chakra-ui/react";

import NextLink from "next/link";

import { UserIcon } from "../atoms/UserIcon";

import { GiHamburgerMenu } from "react-icons/gi";
import UserMenu from "../atoms/UserMenu";

export const ClientComp = memo(() => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flex
        as="nav"
        bg="teal.500"
        color="gray.50"
        align="center"
        justify={"space-between"}
        padding={{ base: 3, md: 5 }}
      >
        <Heading as="h1" fontSize={{ base: "md", md: "lg" }}>
          WARIKAN
        </Heading>
        <Flex
          grow={2}
          align="center"
          fontSize="sm"
          display={{ base: "none", md: "flex" }}
        >
          <Box pr={3} pl={2}>
            <Link href="/home/register-receipt" _hover={{ color: "blue.200" }}>
              とうろく
            </Link>
          </Box>
          <Link
            href="/home/registered-receipt-list"
            _hover={{ color: "blue.200" }}
          >
            りれき
          </Link>
          <Spacer />
        </Flex>
        <Flex align="center" gap="5px">
          <IconButton
            aria-label="open menu"
            variant="ghost"
            display={{ base: "flex", md: "none" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <GiHamburgerMenu color="white" />
          </IconButton>
          <UserMenu />
        </Flex>
      </Flex>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>メニュー</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Stack mb={5}>
                  <Button
                    asChild
                    bg={"teal.500"}
                    color="gray.50"
                    _hover={{ opacity: 0.8 }}
                  >
                    <Drawer.CloseTrigger asChild>
                      <NextLink href="/home/register-receipt">
                        とうろく
                      </NextLink>
                    </Drawer.CloseTrigger>
                  </Button>
                  <Button
                    asChild
                    bg={"teal.500"}
                    color="gray.50"
                    _hover={{ opacity: 0.8 }}
                  >
                    <Drawer.CloseTrigger asChild>
                      <NextLink href="/home/registered-receipt-list">
                        りれき
                      </NextLink>
                    </Drawer.CloseTrigger>
                  </Button>
                </Stack>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
});
