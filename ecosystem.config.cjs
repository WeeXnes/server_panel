module.exports = {
    apps: [
        {
            name: 'ServerPanel',
            port: '6060',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}
