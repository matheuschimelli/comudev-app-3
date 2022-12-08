export default function handler(req, res) {
    res.status(200).json({ 
      message: 'Api do ComuDEV', 
      version:1, 
      details:"Para informações, acesse a página de informações da API"
     })
  }