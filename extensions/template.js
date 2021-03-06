module.exports = (toolbox) =>
{
    if(toolbox.parameters.command == 'add:api')
    {
        toolbox.readTemplate = readTemplate
        toolbox.createModule = createModule
        toolbox.createController = createController
        toolbox.createSubdomainController = createSubdomainController
    }
}

const readTemplate = async (toolbox, module) =>
{
    toolbox.print.info("- Procurando template")
    module.template.data = toolbox.filesystem.read(module.template.file)

    if(!module.template.data)
    {
        toolbox.print.error(`- Template não encontrado: ${module.template.file}`)
        process.exit(0)
    }

    toolbox.print.success("- Template encontrado")
    module.template.data = JSON.parse(module.template.data)

    const data = module.template.data

    return data
}

const createModule = async (toolbox) =>
{
    toolbox.print.success("- Adicionando: api/app.js")
    await toolbox.template.generate({
        template: 'app.js',
        target: `api/app.js`,
    })

    toolbox.print.success("- Adicionando: api/authentication.js")
    await toolbox.template.generate({
        template: 'middlewares/security.js',
        target: `api/middlewares/security.js`,
    })

    toolbox.print.success("- Adicionando: configurações do módulo no arquivo .env")
    let env = `# Configurações da API\n`
    env += `API_PORT=\n\n`
    toolbox.filesystem.append('.env', env)

    toolbox.print.success("- Adicionando: módulo no arquivo service.js")
    toolbox.filesystem.append('service.js', `require("./api/app")\n`)
}

const createController = (toolbox, controllers) =>
{
    toolbox.print.info("- Adicionando Controllers")

    controllers.map(async (controller) => {
        const controllerProps = 
        {
            subdomainControllerRoutes: "",
            subdomain: `${controller.subdomain}`
        }

        controller.data.map(routes => {
            const authentication = (routes.authentication) ? "SecurityMiddleware, " : ""

            routes.type.map(route => {
                controllerProps.subdomainControllerRoutes +=
`
router.${route.toLowerCase()}("${routes.url}", ${authentication} async (request, response) => {
    const result = await Controller.${routes.subdomainControllerMethod}(request)
    response.status(result.status).send(result.body)
});

`
            })
        })

        toolbox.print.success(`Subdomínio: ${controller.subdomain}`)

        await toolbox.template.generate({
            props: controllerProps,
            template: `routes/route.ejs`,
            target: `api/routes/${controller.subdomain.charAt(0).toUpperCase()}${controller.subdomain.slice(1)}.js`
        })
    })
}

const createSubdomainController = (toolbox, controllers) =>
{
    toolbox.print.info("- Adicionando Controller ao subdomínio")

    controllers.map(async (controller) => {
        const controllerProps = 
        {
            methods: "",
            subdomain: `${controller.subdomain.charAt(0).toUpperCase()}${controller.subdomain.slice(1)}`
        }

        controller.data.map(method => {
                controllerProps.methods +=
`
    static async ${method.subdomainControllerMethod}(request)
    {
        let response = 
        {
            status: 200,
            body: await ${controllerProps.subdomain}.${method.subdomainControllerMethod}()
        }

        return response
    }
`
        })

        toolbox.print.success(`Subdomínio: ${controller.subdomain}`)

        await toolbox.template.generate({
            props: controllerProps,
            template: `domain/controller.ejs`,
            target: `domain/${controllerProps.subdomain}/Controller.js`
        })
    })
}
