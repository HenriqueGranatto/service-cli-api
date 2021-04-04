module.exports = (toolbox) =>
{
    if(toolbox.parameters.command == 'add:api')
    {
        toolbox.validate = validateAddAPI
    }
}

const validateAddAPI = (toolbox) =>
{
    toolbox.print.info("###################################################")
    toolbox.print.info("##                  Iniciando                    ##")
    toolbox.print.info("###################################################")
    toolbox.print.info("- Analisando solicitação")

    if(typeof toolbox.parameters.options.template != "string")
    {
        toolbox.print.error('- Comando incorreto: É obrigatório o envio de um template para instalação do módulo. Somente um template deve ser enviado')
        toolbox.print.info(`Exemplo: service-cli add:api --template template.json`)
        process.exit(0)
    }

    const module = 
    {
        name: toolbox.parameters.command.split(":")[1],
        template: 
        {
            file: toolbox.parameters.options.template,
        }
    }

    toolbox.print.success("- Solicitação aceita")
    toolbox.print.success("- Iniciando procedimento de instalação do módulo")

    return module
}