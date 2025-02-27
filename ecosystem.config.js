export const apps = [
    {
        name: 'ServerPanel',
        port: '6060',
        exec_mode: 'fork',
        instances: 1,
        script: './.output/server/index.mjs'
    }
];
