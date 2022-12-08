/**
 * Importações dos componentes React, Codemirror e Socket.io client-side
 */

import * as React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { useState, useEffect } from 'react';
import { Grid, GridItem, Box } from '@chakra-ui/react'
import io from 'socket.io-client'
//import ResizePanel from "react-resize-panel";


//Instância socket.io do lado do cliente para receber a resposta do servidor e enviar requisições em tempo real
const socket = io();

//Componente do editor que recebe a propriedade que guia as alterações para sala correta
function Editor({ roomId, data }) {

  /**
   * 1. Recebe e armazena o estado do editor, com o código
   * 2. Recebe e armazena o nome do usuário, por padrão default
   */
  const [userCode, setUserCode] = useState("");
  const [username, setUsername] = useState("default")

  //Constante para guiar se o código deve ou não ser enviado
  const [shouldSendCode, setShouldSendCode] = useState(false);

  const [users, setUsers] = useState([])


  useEffect(() => {
    console.log("DATAAA", data.code)
    setUserCode(data.code)
  }, [data])

  const saveCode = async () => {
    await fetch(`/api/projects/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({
        code: userCode
      })
    })
  }



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      saveCode().then(() => console.log("codigo salvo"))
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [userCode])

  useEffect(() => {
    //Recebe o user nome alocado na página
    setUsername(window.localStorage.getItem("username"))

  }, [roomId])


  useEffect(() => {
    //Recebe as alterações no editor
    socket.on('CODE_CHANGED', (code) => {
      setShouldSendCode(false)
      setUserCode(code)

    })

    //Informa o erro para conectar
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })


    socket.on('connect', () => {
      socket.emit('CONNECTED_TO_ROOM', { roomId, username })
    })

    socket.on('disconnect', () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
    })

    socket.on('ROOM:CONNECTION', (users) => {
      setUsers(users)
      console.log(users)
    })

    return () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
    }
  }, [])

  /**
   * Ao ocorrer alteração no editor, as esterações dele são transmitidas para os outros usuários
   */


  useEffect(() => {
    if (shouldSendCode) {
      socket.emit('CODE_CHANGED', userCode)

    }
  }, [userCode])


  /**
   * Informa que o código pode ser enviado para os outros usuários e seta o próprio código como novo valor
   */
  const handleCodeMirrorOnChange = (value, viewUpdate) => {
    console.log("value", value)
    console.log("viewUpdate", viewUpdate)
    setShouldSendCode(true)
    setUserCode(value)

  }

/*
  const [hidden, show] = useState('flex');
  const [drawer_hidden, drawer_show] = useState('1');
  const [pannel_hidden, pannel_show] = useState('4');
  const [pannel_height, setpannel_height] = useState('400px');

  const drawer_hide = () => {
    let on = hidden;

    if (on === "flex") {
      pannel_show("1");
      show("none");
      drawer_show("0");
      setpannel_height("790px");


    } else {
      pannel_show("4");
      setpannel_height("650px");
      show("flex");
      drawer_show("1");

    }
  }*/

  /**
   * Instância do Codemirror, recebe o valor atual do editor, a mudança de valor nele aciona
   * o disparo para a permissão do compartilhamento desse valor
   * 
   * Iframe recebe o valor atual do código e renderiza o que é possível como página
   */
  return (
    <>
      <Grid templateRows='repeat(2, 1fr)'>
        <GridItem>
          <iframe
            height={450}
            width="100%"
            className="preview"
            srcDoc={userCode}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
          />
        </GridItem>
        <GridItem>
          <CodeMirror
            value={userCode}
            height="450px"
            width="auto"
            theme={dracula}
            extensions={[javascript({ jsx: true })]}
            onChange={handleCodeMirrorOnChange}
          />
        </GridItem>
      </Grid>


      {/*<Box display="flex" flexDir="row" height="100%" w="100%">
            <ResizePanel
              direction="e"
              style={{ backgroundColor: "black", maxHeight: pannel_height, flexGrow: pannel_hidden }}
            >
              <div style={{ backgroundColor: "white", width: "100%" }}>
                <Box w="100%" height="100%" display="flex">
                  <iframe
                    frameBorder="0"
                    height="100%"
                    width="100%"
                    srcDoc={userCode}
                    title="output"
                    sandbox="allow-scripts"
                  />
                </Box>
              </div>
            </ResizePanel>
      </Box>
      <Box style={{ flexGrow: drawer_hidden }} height="100%">
            <div onClick={drawer_hide} className="resize_bar"></div>
          <Box style={{ display: hidden }}
            >
              <Box w="100%">
                <CodeMirror
                  value={userCode}
                  height="450px"
                  width="auto"
                  theme={dracula}
                  extensions={[javascript({ jsx: true })]}
                  onChange={handleCodeMirrorOnChange}
                />
              </Box>
          </Box>
    </Box>*/}


    </>
  );
}
export default Editor;