export const apps = [
    {
        name: 'ServerPanel',
        port: '6060',
        exec_mode: 'fork',
        instances: 'max',
        script: './.output/server/index.mjs'
    }
];
