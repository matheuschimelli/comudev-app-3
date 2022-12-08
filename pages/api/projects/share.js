import { getSession } from "next-auth/react";
import prisma from "../../../src/lib/prisma";

export default async (req, res) => {
  try {

    const session = await getSession({ req });
    if (!session)
      return res
        .status(400)
        .send({ error: true, message: "Você não tem permissão de acesso." });

    if (req.method === "POST") {
      const body = JSON.parse(req.body)
      const projectId = body.projectId
      const email = body.email


      if (!projectId || !email) {
        return res.status(400).send({ error: true, message: "Id do projeto e email não podem ficar em branco" })
      }

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          owners: {
            some: {
              email: session.user.email
            }
          }
        }
      })

      if (!project) {
        return res.status(400).send({ error: true, message: "Você não tem permissão para compartilhar esse projeto" })
      }

      const existEmail = await prisma.user.findFirst({
        where: {
          email
        }
      })
      if (!existEmail) {
        return res.status(400).send({ error: true, message: "Usuário não existe" })
      }
      const updateProject = await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          owners: {
            connect: {
              email: email
            }
          }
        },
        include: {
          owners: true
        }
      })

      return res.send(updateProject)
    }

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Não foi possível concluir a solicitação" });
  }
};
