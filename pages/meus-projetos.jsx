/**
 * Componente que cria dinâmicamente uma rota para a sala, renderizando a sala para o usuário conforme o id
 * Serviço baseado no framework next
 * Editor recebe a negação do Server-Side Rendering para carregar os elementos React no HTML
 *  */
import DefaultLayout from "../src/components/layout/DefaultLayout";
import { getSession } from "next-auth/react";
import prisma from "../src/lib/prisma"
import { Box, Text, Input, Button, useToast, Flex, Grid, GridItem} from "@chakra-ui/react"
import { useRouter } from "next/router"

export default function Room({ projects }) {
    const router = useRouter()

    const redHome = async () => {
        return router.push(`/`)
    }

    return (
        <DefaultLayout title="Editor - ComuDEV">
            <Box
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                textAlign={{
                    base: "center",
                    md: "center",
                }}
            >
            <Text
                display={{
                        base: "block",
                        lg: "inline",
                    }}
                w="full"
                bgClip="text"
                bgGradient="linear(to-r, pink.400,purple.500)"
                fontWeight="extrabold"
                fontSize={{
                    base: "4xl",
                    md: "6xl",
                }}
            >
                Seus Projetos
            </Text>
            
            {!projects && (
                <Text 
                    fontSize="2xl"
                    fontWeight="extrabold"
                >
                        Você não tem nenhum projeto
                </Text>

            )}
            </Box>
            {projects && projects.length !== 0 && projects.map((project) => {
                const redProject = async (event) => {
                    return router.push(`/room/${project.id}`)
                }
                return (
                    <Flex
                        bg="transparent"
                        _dark={{
                            bg: "transparent",
                        }}
                        p={50}
                        w="full"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid templateColumns='repeat(1, 1fr)'>
                        <GridItem>
                        <Box
                            w="full"
                            maxW="sm"
                            mx="auto"
                            px={4}
                            py={3}
                            bg="gray.400"
                            _dark={{
                            bg: "gray.700",
                            }}
                            shadow="md"
                            rounded="md"
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text
                                    as="p"
                                    fontSize="sm"
                                    color="gray.600"
                                    _dark={{
                                    color: "gray.400",
                                    }}
                                >
                                    Seu projeto Comudev
                                </Text>
                                <Text 
                                    as="p"
                                    color="brand.800"
                                    _dark={{
                                    color: "brand.900",
                                    }}
                                    px={3}
                                    py={1}
                                    rounded="full"
                                    textTransform="uppercase"
                                    fontSize="xs"
                                >
                                    Privado
                                </Text>
                            </Flex>
                            <Box>
                                <Text
                                    as="h1"
                                    fontSize="lg"
                                    fontWeight="bold"
                                    mt={2}
                                    color="gray.800"
                                    _dark={{
                                    color: "white",
                                    }}
                                >
                                    {project.name}
                                </Text>
                            </Box>
                            <Box>
                                <Flex
                                    alignItems="center"
                                    mt={2}
                                    color="gray.700"
                                    _dark={{
                                    color: "gray.200",
                                    }}
                                >
                                <Button
                                    color="green.600"
                                    _dark={{
                                        color: "green.400",
                                    }}
                                    onClick={redProject}
                                >
                                    Entrar
                                </Button>
                                </Flex>
                            </Box>
                        </Box>
                        </GridItem>
                        </Grid>
                    </Flex>
                )
            })}
            <Box
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                textAlign={{
                    base: "center",
                    md: "center",
                }}
            >
            <Button
                width="20%"
                bg="gray.700"
                _dark={{
                    bg: "gray.600"
                }}
                color="red.400"
                onClick={redHome}
            >
                Voltar
            </Button>
            </Box>

        </DefaultLayout >
    )
}

export async function getServerSideProps({ req }) {


    const session = await getSession({ req })
    if (!session) {
        return {
            notFound: true,
        }
    }

    const projects = await prisma.project.findMany({
        where: {
            owners: {
                some: {
                    email: session.user.email
                }
            }
        }
    })

    if (!projects) {
        return {
            projects: null,
        }
    }
    return {
        props: {
            projects: JSON.parse(JSON.stringify(projects))
        }, 
    }
}