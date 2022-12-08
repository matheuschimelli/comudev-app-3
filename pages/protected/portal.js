/**
 * Importação da transformação de importe dinâmico
 * Importação da tela de login negando o Server-Side Rendering
 * O html da página irá carregar, mas os componentes next que dão sentido a ela não.
 */
import dynamic from 'next/dynamic'
const Project = dynamic(() => import('../../src/components/islog/Project'), {
  ssr: false,
})
export default function Portal() {
  return (
    <Project />
  )
}