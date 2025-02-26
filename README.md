# Server Control Panel


![WebStorm](https://img.shields.io/badge/WebStorm-000000?style=for-the-badge&logo=WebStorm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Nuxt.js](https://img.shields.io/badge/nuxt%20js-00C58E?style=for-the-badge&logo=nuxtdotjs&logoColor=white)
![DaisyUI](https://img.shields.io/badge/daisyUI-1ad1a5?style=for-the-badge&logo=daisyui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Overview

Server Control Panel is a web-based interface for monitoring and managing QEMU virtual machines and system services. Built with **Nuxt.js** and styled using **DaisyUI**, this panel provides real-time system information using the **systeminformation** NPM package.

## Features

- Display OS, CPU, and Memory Information
- Manage QEMU Virtual Machines (Start/Shutdown)
- View and Control System Services (Start/Stop functionality removed in the latest version)
- Clean and modern UI

## Technologies Used

- **Nuxt.js** - Vue.js-based framework for SSR and static site generation
- **DaisyUI** - Tailwind CSS component library for styling
- **systeminformation** - Node.js library for retrieving system and hardware details

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- NPM or Yarn
- QEMU installed on the host system

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/WeeXnes/server_panel.git
   cd server_panel
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the panel in your browser at `http://localhost:3000`

## Configuration

Modify the `panel.config.ts` file (if needed) to configure VM management and system services settings.

```ts
import { reactive } from "vue";

export const settings = reactive({
    ignoreCache: true,
    // Leave empty to scan all interfaces
    // or change item to "disabled" to disable interface scanning
    interfaces_to_scan:[
        "eth0"
    ],
    // enable or disable QEMU controls
    enable_qemu_controls: true,
    // list the qemu vm names you want to monitor/scan for
    qemu_vms: [
        {
            name: "Gameserver",
            // OS Info has to be declared here due to technical 
            // limitations of not being able to gather vm OS info
            os: "Ubuntu 24.04"
        },
        {
            name: "Ubuntu_VM1",
            os: "Ubuntu 24.04"
        },
    ],
    //enable or disable systemctl service monitoring
    enable_services: true,
    //list systemctl services to monitor/scan for
    systemctl_services:[
        "libvirt",
        "frp"
    ]
});
```


## Usage

- The dashboard provides an overview of system information.
- You can start or shut down virtual machines.
- Service monitoring


## Author

Developed by **WeeXnes**

