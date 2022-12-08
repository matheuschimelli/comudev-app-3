/**
 * Componente que cria dinâmicamente uma rota para a sala, renderizando a sala para o usuário conforme o id
 * Serviço baseado no framework next
 * Editor recebe a negação do Server-Side Rendering para carregar os elementos React no HTML
 *  */
import { useState } from "react"
import DefaultLayout from "../../src/components/layout/DefaultLayout";
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import prisma from "../../src/lib/prisma"
import { Box, Text, Input, Button, useToast } from "@chakra-ui/react"
const Editor = dynamic(() => import('../../src/components/editor/Codemirror'), {
    ssr: false,
})
export default function Room({ project }) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")


    const handleEmail = (event) => {
        setEmail(event.target.value)
    }

    const shareProject = async () => {
        setIsLoading(true)

        if (!email || email === "") {
            setIsLoading(false)

            return toast({
                title: "Email inválido",
                description: "Insira um endereço de e-mail válido",
                isClosable: true,
                status: "error"
            })
        }
        try {
            const response = await fetch("/api/projects/share", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    projectId: router.query.id
                })
            })

            if (response.status !== 200) {
                setIsLoading(false)

                return toast({
                    title: "Não foi possível criar um novo projeto",
                    description: "Houve um erro inesperado. Tente mais tarde",
                    isClosable: true,
                    status: "error"
                })
            }
            const projectDetails = await response.json()
            setIsLoading(false)
            toast({
                title: "Projeto Criado",
                description: "Você será redirecionado para seu projeto",
                isClosable: true,
                status: "success"
            })

            console.log(projectDetails)


            return toast({
                title: "Sucesso",
                description: "Usuário adicionado ao projeto",
                status: "success"
            })
        } catch (error) {
            console.log(error)
            return toast({
                title: "Erro",
                description: "Não foi possível enviar o convite",
                status: "error"
            })
        }

    }
    return (
        <DefaultLayout title="Editor - ComuDEV">
            <Box
                p="5"
                display="flex"
                flexDir="row"
                gridGap="5"
                justifyItems="center"
                alignItems="center"
                w="100%"
            >
                <Box>
                    <Text fontWeight="bold">Compartilhe o projeto</Text>
                </Box>
                <Box display="flex" flexDir="row" gridGap="5">
                    <Input placeholder="Email do Usuário" onChange={handleEmail} type="email" />
                    <Button colorScheme="teal" onClick={shareProject}>Convidar</Button>
                </Box>
            </Box>

            <Editor roomId={router.query.id} data={project} />

        </DefaultLayout >
    )
}

export async function getServerSideProps({ req }) {

    console.log("PARAM", req.params)
    console.log("QUERY", req.query)
    const id = req.params[0].split("/").slice(-1)[0]
    if (!req.query.id && !id) {
        return {
            notFound: true,
        }
    }
    const projectId = req.query.id ? req.query.id : id
    console.log("REQ QUERY", projectId)

    const session = await getSession({ req })
    if (!session) {
        return {
            notFound: true,
        }
    }

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owners: {
                some: {
                    email: session.user.email
                }
            }
        },
        include: {
            owners: true
        }
    })



    if (!project) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            project: JSON.parse(JSON.stringify(project))
        }, // will be passed to the page component as props
    }
}