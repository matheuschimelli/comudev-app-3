import { Box, Text, Avatar, Button } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Flex,
  chakra,
  Icon
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import CodeIcon from "../../components/icons/CodeIcon";
import { useColorMode } from "@chakra-ui/color-mode";

import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function DefaultLayout({ title, children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession();

  return (
    <>
      <Box display="flex" flexDir="column">
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>{title}</title>
        </Head>
        <Box
          display="flex"
          flexDir="row"
          p="4"
          backgroundColor="white"
          justifyContent="space-between"
          alignContent="center"
          alignItems="center"
          shadow="base"
          _dark={{
            backgroundColor: "transparent",
          }}
        >
          <Box
            display="flex"
            flexDir="row"
            gridGap="3"
            alignContent="center"
            alignItems="center"
          >
            <CodeIcon fontSize="3xl" />

            <Link href="/">
              <Text fontSize="xl" fontWeight="bold">
                ComuDEV-APP
              </Text>
            </Link>
            {/* <Grid templateRows={2} gap={6}>
            <GridItem>
              <Text fontWeight="bold" fontSize="xl">
                ComuDEV-APP
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize="x6">
                Para Comunidade Brasileira de Desenvolvimento Web
              </Text>
            </GridItem>
          </Grid> */}
          </Box>

          <Box
            display="flex"
            flexDir="row"
            gridGap="3"
            alignContent="center"
            alignItems="flex-end"
          >
            <Box>
              <IconButton
                mt={4}
                aria-label="Toggle Mode"
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </IconButton>
            </Box>

            {session && session.user.image && (
              <Menu>
                <MenuButton
                  as={Avatar}
                  name={session.user.name}
                  src={session.user.image}
                  cursor="pointer"
                ></MenuButton>

                <MenuList>
                  <MenuItem>Bem vindo {session.user.name}</MenuItem>
                  <MenuDivider />
                  <Link href="/meus-projetos">
                    <MenuItem as="a">Meus projetos</MenuItem>
                  </Link>

                  <MenuItem onClick={signOut}>Sair</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!session && <Button onClick={signIn}>Fazer login</Button>}
          </Box>
        </Box>
        <Box>{children}</Box>
      </Box>

    
    </>
  );
}
