import { getSession } from "next-auth/react";
import prisma from "../../../src/lib/prisma";

const defaultHtml = `
<!DOCTYPE html>
<html>
<head>
<style>

body {
  background-color: #565;
}

div {
  margin-top: 10%;
  font-family: "Courier new";
}
h1 {
  text-align: center;
  text-transform: uppercase;
  color: #4CAF50;
  text-shadow: 2px 2px 5px black;
}

p {
  color: white;
  text-indent: 50px;
  text-align: justify;
  letter-spacing: 3px;
  text-shadow: 2px 2px 5px #565656;
}

a {
  text-decoration: none;
  color: #008CBA;
}
</style>
</head>
<body>
<div>
  <h1>Bem vindo ao seu editor colaborativo de código</h1>
  <p>Comece agora mesmo a desenvolver em ambiente online e colaborativo. Convide seus colegas para editar junto com você. 
    Apague o conteúdo do editor abaixo e inicie a escrita da sua aplicação. Todo o conteúdo HTML será renderizado aqui. Não tema! 
    Se você sair o código estará salvo para que você possa voltar a continuar a editá-lo. 
    Para mais informações recomendamos que   
  <a target="_blank" href="">saiba mais</a>.</p>
</div>
</body>
</html>
`;

export default async function handler(req, res) {
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
    const userSessionId = session.user.id;

    console.log("SESSSION", session)

    /**
     * Retorna uma lista de projetos do usuário logado
     *
     * */
    if (req.method === "GET") {
      const userProjects = await prisma.project.findMany({
        where: {
          owners: {
            id: userSessionId
          }
        },
      });

      if (!userProjects || userProjects.lenght === 0)
        return res
          .status(400)
          .send({ error: true, message: "Nenhum projeto encontrado" });

      return res.send(userProjects);
    }

    /**
     * Cria um projeto
     * 
     * manoo
     * 
     */
    if (req.method === "POST") {

      const body = JSON.parse(req.body)
      const { name } = body

      console.clear()
      console.log("REQ BODY", body)

      const newProject = await prisma.project.create({
        data: {
          owners: {
            connect: {
              email: session.user.email,
            },
          },
          name: name,
          code: defaultHtml,
          public: false,
        },
      });

      if (!newProject)
        return res
          .status(400)
          .send({
            error: true,
            message: "Não foi possível criar um novo projeto. Tente mais tarde",
          });

      return res.send(newProject);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Não foi possível concluir a solicitação" });
  }
}
