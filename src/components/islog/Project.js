import { useState } from "react";
import {
  Center,
  Box,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Project() {
  /**
   * Armazenamento do input do usuário como estado do app
   */
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  //Seta o nome do usuário com base no retorno do input
  const handleProjectName = async (event) => {
    setProjectName(event.target.value);
  };

  /**
   * Ao disparar o botão, o usuário recebe o redirecionamento para sua sala
   */
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: projectName }),
      });

      if (response.status !== 200) {
        setIsLoading(false);

        return toast({
          title: "Não foi possível criar um novo projeto",
          description: "Houve um erro inesperado. Tente mais tarde",
          isClosable: true,
          status: "error",
        });
      }
      const projectDetails = await response.json();
      setIsLoading(false);
      toast({
        title: "Projeto Criado",
        description: "Você será redirecionado para seu projeto",
        isClosable: true,
        status: "success",
      });

      console.log("projectdetail", projectDetails);

      return router.push(`/room/${projectDetails.id}`);
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: "Não foi possível criar um novo projeto",
        description: "Houve um erro inesperado. Tente mais tarde",
        isClosable: true,
        status: "error",
      });
    }
  };

  const redMyProject = async (event) => {
    return router.push(`/meus-projetos`);
  };
  
  return (
    <Center>
      <Box
        shadow="md"
        display="flex"
        flexDir="column"
        gridGap="5"
        p="10"
        rounded="md"
        mt="20"
        as="form"
      >
        <Text as="h1" fontWeight="bold" fontSize="2xl">
          Crie um novo projeto seguindo os passos abaixo
        </Text>
        <Text fontWeight="thin">Escolha um nome para o seu projeto</Text>
        <Box
          as="form"
          display="flex"
          flexDir="column"
          gridGap="3"
          onSubmit={handleOnSubmit}
        >
          <FormControl>
            <FormLabel>Nome do projeto</FormLabel>
            <Input
              placeholder="Dê um nome ao projeto"
              name="projectName"
              onChange={handleProjectName}
            />
          </FormControl>

          <Button
            colorScheme="teal"
            isLoading={isLoading}
            onClick={handleOnSubmit}
            type="submit"
          >
            Começar!
          </Button>

          <Button
            color="darkgreen"
            backgroundColor="#373737"
            onClick={redMyProject}
          >
            Ir para os meus projetos
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
