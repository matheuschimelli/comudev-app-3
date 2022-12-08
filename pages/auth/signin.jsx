import { getProviders, signIn, useSession } from "next-auth/react";
import {
  Button,
  Box,
  SimpleGrid,
  Grid,
  chakra,
  Flex,
  GridItem,
  Center,
  VisuallyHidden,
  Input,
  Icon,
} from "@chakra-ui/react";
import DefaultLayout from "../../src/components/layout/DefaultLayout";
import Portal from "../protected/portal";

export default function SignIn({ providers }) {
  const { data: session } = useSession();

  if (session) {
    return (
      <DefaultLayout>
        <Portal />
      </DefaultLayout>
    );
  } else {
  return (
    <DefaultLayout>
      {/* <Box>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button onClick={() => signIn(provider.id)}>
            Entrar com {provider.name}
          </Button>
        </div>
      ))}
    </Box> */}

      <Box px={8} py={24} mx="auto">
        <SimpleGrid
          alignItems="center"
          w={{
            base: "full",
            xl: 11 / 12,
          }}
          columns={{
            base: 1,
            lg: 11,
          }}
          gap={{
            base: 0,
            lg: 24,
          }}
          mx="auto"
        >
          <GridItem
            colSpan={{
              base: "auto",
              lg: 7,
            }}
            textAlign={{
              base: "center",
              lg: "left",
            }}
          >
            <chakra.h1
              mb={4}
              fontSize={{
                base: "3xl",
                md: "4xl",
              }}
              w="full"
              bgClip="text"
              bgGradient="linear(to-r, green.400,purple.500)"
              fontWeight="extrabold"
              letterSpacing={{
                base: "normal",
                md: "tight",
              }}
            >
              Pronto para começar sua jornada?
            </chakra.h1>
            <chakra.p
              mb={{
                base: 10,
                md: 4,
              }}
              fontSize={{
                base: "lg",
                md: "xl",
              }}
              fontWeight="thin"
              color="gray.500"
              letterSpacing="wider"
            >
              Colaboração de código em tempo real, para projetos, equipes,
              professores e amigos.
            </chakra.p>
          </GridItem>
          <GridItem
            colSpan={{
              base: "auto",
              md: 4,
            }}
          >
            <Box as="form" mb={6} rounded="lg" shadow="xl">
              <Center
                pb={0}
                color="gray.700"
                _dark={{
                  color: "gray.600",
                }}
              >
                <chakra.p pt={2}>Crie um projeto agora mesmo</chakra.p>
              </Center>
      
              <Flex px={6} py={4}>
                <Button
                  py={2}
                  w="full"
                  colorScheme="gray"
                  onClick={() => signIn("github")}
                  leftIcon={
                    <Icon
                      mr={1}
                      aria-hidden="true"
                      boxSize={6}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="transparent"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </Icon>
                  }
                >
                  Continuar com Github
                </Button>
              </Flex>
              <Flex px={6} py={4}>
                <Button
                  py={2}
                  w="full"
                  colorScheme="blue"
                  onClick={() => signIn("google")}

                  leftIcon={
                    <Icon
                      mr={1}
                      aria-hidden="true"
                      boxSize={6}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="transparent"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.283,10.356h-8.327v3.451h4.792c-0.446,2.193-2.313,3.453-4.792,3.453c-2.923,0-5.279-2.356-5.279-5.28	c0-2.923,2.356-5.279,5.279-5.279c1.259,0,2.397,0.447,3.29,1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233	c-4.954,0-8.934,3.979-8.934,8.934c0,4.955,3.979,8.934,8.934,8.934c4.467,0,8.529-3.249,8.529-8.934	C20.485,11.453,20.404,10.884,20.283,10.356z" />
                    </Icon>
                  }
                >
                  Continuar com Google
                </Button>
              </Flex>
            </Box>
            <chakra.p fontSize="xs" textAlign="center" color="gray.600">
              Ao criar uma conta ou fazer login você concorda com os nossos{" "}
              <chakra.a color="brand.500">
                Termos de Uso e Política de Privacidade
              </chakra.a>
            </chakra.p>
          </GridItem>
        </SimpleGrid>
      </Box>
    </DefaultLayout>
  );
  }
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
