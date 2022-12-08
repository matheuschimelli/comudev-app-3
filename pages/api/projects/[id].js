import { getSession } from "next-auth/react";
import prisma from "../../../src/lib/prisma";

export default async (req, res) => {
  try {
    /**
     * Verifica se o usuário está logado, se não retorna um erro 400 avisando que
     * ele não tem permissão para acessar a página.
     */
    const session = await getSession({ req });
    if (!session)
      return res
        .status(400)
        .send({ error: true, message: "Você não tem permissão de acesso." });

    /**
     * Pega o ID de usuário logado na sessão e faz uma query no banco
     * pra retornar somente os projetos do usuário logado
     */
    const userSessionId = session.id;


    /**
     * Pega o id do projeto passado pelo parâmetro id na url
     */
    const projectId = req.query.id;

    /**
     * Retorna o projeto solicitado de acordo com o parâmetro ID passado no url
     *
     * */
    if (req.method === "GET") {

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
        },
      });

      if (!project || project.lenght === 0) return res.send(project);

      return res.send(project);
    }

    /**
     * Cria um projeto
     */
    if (req.method === "PUT") {

      const body = JSON.parse(req.body)

      /**
       * Pega os parâmetros passados no PUT request: name e code
       */
      const { code } = body

      const updateProject = await prisma.project.update({
        where: {
          id: projectId
        },
        data: {
          code
        },
      });

      if (!updateProject)
        return res
          .status(400)
          .send({
            error: true,
            message: "Não foi possível criar um novo projeto. Tente mais tarde",
          });

      return res.send(updateProject);
    }

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Não foi possível concluir a solicitação" });
  }
};