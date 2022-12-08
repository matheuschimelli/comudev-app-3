
// 1. Importação do tema do chakra
import { extendTheme } from '@chakra-ui/react'

// 2. Configurando o modo de cor da tela preferencial
const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

// 3. Exportando a extensão com o tema
const theme = extendTheme({ config })

export default theme