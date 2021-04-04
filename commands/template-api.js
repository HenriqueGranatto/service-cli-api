const command = {
    name: 'template:api',
    run: async toolbox => {
        toolbox.print.success("- Adicionando: api.json")
        await toolbox.template.generate({
            template: 'template.json',
            target: `api.json`,
        })
    }
  }
  
  module.exports = command