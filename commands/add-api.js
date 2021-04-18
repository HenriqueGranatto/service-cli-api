const command = {
    name: 'add:api',
    description: 'Adiciona uma api HTTP ao serviço (Express)'
    run: async toolbox => {
      const module = await toolbox.validate(toolbox)
      
      toolbox.print.info("\n")
        toolbox.print.info("###################################################")
        toolbox.print.info("##       Instalando dependências do Módulo       ##")
        toolbox.print.info("###################################################")
        toolbox.print.info(await toolbox.system.run('npm install express'))

        toolbox.print.info("###################################################")
        toolbox.print.info("##         Adicionando módulo ao projeto         ##")
        toolbox.print.info("###################################################")
        await toolbox.createModule(toolbox)

        toolbox.print.info("\n")
        toolbox.print.info("###################################################")
        toolbox.print.info("##         Executando template do módulo         ##")
        toolbox.print.info("###################################################")
        const controllers = await toolbox.readTemplate(toolbox, module)
        await toolbox.createController(toolbox, controllers)

        toolbox.print.info("\n")
        toolbox.print.success(`Módulo ${module.name} adicionado com sucesso!`)
        toolbox.print.info("\n")
    }
  }
  
  module.exports = command
