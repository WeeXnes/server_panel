<script setup lang="ts">
import type { VM } from '~/types/VM';
import { reactive, ref } from 'vue';
import axios from 'axios';
import type {networkInterface} from "~/types/networkInterface";
import type {serviceInterface} from "~/types/serviceInterface";
import {checkAuth} from "~/util/auth";



const startVm = async (vm: any) => {
  try {
    const response = await axios.post('/api/controlVM', {
      action: 'start',
      vm: vm
    });
    console.log(response.data);
    if(response.data.status == 'success') {
      vmInfo.vms.forEach(vm_list => {
        if(vm.name == vm_list.name) {
          vm_list.state = "on";
        }
      })
    }
  } catch (error) {
    console.error(`Error starting VM: ${vm.name}`, error);
  }
};

const shutdownVm = async (vm: any) => {
  try {
    const response = await axios.post('/api/controlVM', {
      action: 'shutdown',
      force: settings.force_shutdown,
      vm: vm
    });
    console.log(response.data);
    if(response.data.status == 'success') {
      vmInfo.vms.forEach(vm_list => {
        if(vm.name == vm_list.name) {
          vm_list.state = "off";
        }
      })
    }
  } catch (error) {
    console.error(`Error shutting down VM: ${vm.name}`, error);
  }
};


const settings = reactive({
  ignoreCache: false,
  enable_services: false,
  enable_qemu_controls: false,
  force_shutdown: false
});

const vmInfo = reactive({
  isLoaded: false,
  vms: [] as VM[],
})

const osInfo = reactive({
  isLoaded: false,
  name: '',
  version: '',
  kernel: '',
  architecture: ''
});

const serviceInfo = reactive({
  isLoaded: false,
  services: [] as serviceInterface[],
});

const cpuInfo = reactive({
  isLoaded: false,
  manufacturer: '',
  model: '',
  cores: 0,
  speed: 0,
  mainTemp: 0,
  maxTemp: 0
});

const memoryInfo = reactive({
  isLoaded: false,
  total: 0,
  free: 0,
  used: 0
});

const networkInfo = reactive({
  isLoaded: true,
  interfacesList:[] as networkInterface[]
})


const fetchServiceInfo = async () => {
  try{
    let services = await $fetch('/api/getServices')
    services?.forEach((interface_obj) => {
      serviceInfo.services.push(interface_obj)
    });
    serviceInfo.isLoaded = true;
  }catch(error){
    console.error(`Error fetchOsInfo: ${error}`);
  }
}

const fetchNetworkInfo = async () => {
  try{
    let networkInfoFetch = await $fetch('/api/getNetworkInterfaces')
    networkInfoFetch?.forEach((interface_obj) => {
      networkInfo.interfacesList.push(interface_obj)
    });

    networkInfo.isLoaded = true
  }catch(error){
    console.error(`Error fetchOsInfo: ${error}`);
  }
}

const fetchOsInfo = async () => {
  try{
    let systemInfoFetch = await $fetch('/api/getSystem')
    console.log(systemInfoFetch)
    osInfo.name = systemInfoFetch?.platform || 'N/A'
    osInfo.version = systemInfoFetch?.distro || 'N/A'
    osInfo.kernel = systemInfoFetch?.kernel || 'N/A'
    osInfo.architecture = systemInfoFetch?.arch || 'N/A'
    osInfo.isLoaded = true
  }catch(error){
    console.error(`Error fetchOsInfo: ${error}`);
  }
}

const fetchCpuTemp = async () => {
  try {
    let cpuInfoFetch = await $fetch('/api/getCpu')
    console.log(cpuInfoFetch)
    cpuInfo.manufacturer = cpuInfoFetch?.info.manufacturer || 'N/A'
    cpuInfo.model = cpuInfoFetch?.info.brand || 'N/A'
    cpuInfo.cores = cpuInfoFetch?.info.cores || 0
    cpuInfo.speed = cpuInfoFetch?.info.speed || 0
    cpuInfo.mainTemp = cpuInfoFetch?.temps.main || 0
    cpuInfo.maxTemp = cpuInfoFetch?.temps.max || 0
  } catch (error) {
    console.error('Error fetching CPU temperature:', error);
  }
};

const fetchMemoryInfo = async () => {
  try{
    let memoryInfoFetch = await $fetch('/api/getMemory')
    console.log(memoryInfoFetch)
    let ram_cache = settings.ignoreCache ? (memoryInfoFetch?.cached ?? 0) : 0;
    if(memoryInfoFetch?.total != null)
      memoryInfo.total = Math.round( memoryInfoFetch?.total/ (1024 * 1024 * 1024)) || 0
    if(memoryInfoFetch?.free != null)
      memoryInfo.free = Math.round( (memoryInfoFetch?.free + ram_cache) / (1024 * 1024 * 1024)) || 0
    if(memoryInfoFetch?.used != null)
      memoryInfo.used = Math.round( (memoryInfoFetch?.used - ram_cache) / (1024 * 1024 * 1024)) || 0
    memoryInfo.isLoaded = true
  }catch(error){
    console.error(`Error fetchOsInfo: ${error}`);
  }
}

const fetchVMs = async () => {
  try{
    let vmInfoFetch = await $fetch('/api/getVMs')
    console.log(vmInfoFetch)
    vmInfoFetch?.forEach(vm => {
      vmInfo.vms.push(vm)
    })
    vmInfo.isLoaded = true
  }catch(error){
    console.error(`Error fetchOsInfo: ${error}`);
  }
}



const fetchSettings = async () => {
  try {
    let settingsFetch = await $fetch('/api/getSettings')
    console.log(settingsFetch)
    settings.ignoreCache = settingsFetch?.ignoreCache || false
    settings.enable_qemu_controls = settingsFetch?.enable_qemu_controls || false
    settings.enable_services = settingsFetch?.enable_services || false
  } catch (error) {
    console.error('Error fetching CPU temperature:', error);
  }
}

onMounted(async () => {
  let isAuthed = await checkAuth(useRouter())
  if(isAuthed){
    await fetchSettings()
    if(settings.enable_qemu_controls) await fetchVMs()
    await fetchOsInfo()
    await fetchCpuTemp()
    cpuInfo.isLoaded = true
    await fetchMemoryInfo()
    await fetchNetworkInfo()
    if(settings.enable_services) await fetchServiceInfo()
    const intervalId = setInterval(fetchCpuTemp, 7000);
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  }
})




</script>


<template>
  <div class="flex flex-col items-center justify-center py-16 px-6">

    <div class="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">


      <div class="card bg-base-100 shadow-2xl p-6 opacity-0 transition-opacity duration-500 ease-in-out"
           :class="{'opacity-100': osInfo.isLoaded}">
        <h2 class="text-xl font-bold text-center">OS Info</h2>
        <div class="mt-4 text-sm">
          <p><strong>Operating System:</strong> {{ osInfo.name }}</p>
          <p><strong>Version:</strong> {{ osInfo.version }}</p>
          <p><strong>Kernel:</strong> {{ osInfo.kernel }}</p>
          <p><strong>Architecture:</strong> {{ osInfo.architecture }}</p>
        </div>
      </div>


      <div class="card bg-base-100 shadow-2xl p-6 opacity-0 transition-opacity duration-500 ease-in-out"
           :class="{'opacity-100': cpuInfo.isLoaded}">
        <h2 class="text-xl font-bold text-center">CPU Info</h2>
        <div class="mt-4 text-sm">
          <p><strong>Manufacturer:</strong> {{ cpuInfo.manufacturer }}</p>
          <p><strong>Model:</strong> {{ cpuInfo.model }}</p>
          <p><strong>Core Count:</strong> {{ cpuInfo.cores }}</p>
          <p><strong>Speed:</strong> {{ cpuInfo.speed }} GHz</p>
          <p><strong>Main Temp:</strong> {{ cpuInfo.mainTemp }} °C</p>
          <p><strong>Max Temp:</strong> {{ cpuInfo.maxTemp }} °C</p>
        </div>
      </div>
      <div class="card bg-base-100 shadow-2xl p-6 opacity-0 transition-opacity duration-500 ease-in-out"
           :class="{'opacity-100': memoryInfo.isLoaded}">
        <h2 class="text-xl font-bold text-center">Memory Info</h2>
        <div class="mt-4 text-sm">
          <p><strong>Total Memory:</strong> {{ memoryInfo.total }} GB</p>
          <p><strong>Free Memory:</strong> {{ memoryInfo.free }} GB</p>
          <p><strong>Used Memory:</strong> {{ memoryInfo.used }} GB</p>
        </div>
      </div>
      <div v-for="ifs in networkInfo.interfacesList" class="card bg-base-100 shadow-2xl p-6">
        <h2 :class="{
                      'text-green-500': ifs.state === 'up',
                      'text-red-500': ifs.state === 'down',
                      'text-yellow-500': ifs.state === 'unknown'
                     }"
            class="text-xl font-bold text-center">Interface: {{ ifs.name }}</h2>
        <div class="mt-4 text-sm">
          <p><strong>Interface Name:</strong> {{ ifs.name }}</p>
          <p><strong>IPv4:</strong> {{ ifs.ip4 }} / {{ ifs.ip4subnet }}</p>
          <p><strong>IPv6:</strong> {{ ifs.ip6 }}</p>
          <p><strong>State:</strong> {{ ifs.state }}</p>
        </div>
      </div>
    </div>

    <h1 v-if="settings.enable_qemu_controls" class="text-4xl font-bold text-center mb-6">QEMU Virtual Machines</h1>
    <div v-if="settings.enable_qemu_controls" class="form-control flex flex-row gap-2 mb-6">
      <label class="label cursor-pointer flex items-center gap-2">
        <span class="label-text">Force Shutdown</span>
        <input
            type="checkbox"
            class="checkbox checkbox-primary"
            v-model="settings.force_shutdown"
        />
      </label>
    </div>
    <div v-if="settings.enable_qemu_controls" class="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
      <div
          v-for="vm in vmInfo.vms"
          class="card bg-base-100 shadow-2xl p-6"
      >
        <h2 :class="vm.state === 'on' ? 'text-green-500' : 'text-red-500'" class="text-xl font-bold text-center">
          {{ vm.name }}
        </h2>
        <div class="mt-2 text-sm">
          <p><strong>OS:</strong> {{ vm.os }}</p>
          <p><strong>CPU(s):</strong> {{ vm.vCpuCount }}</p>
          <p><strong>Max Memory:</strong> {{ vm.maxMemory }} MB</p>
          <p><strong>Autostart:</strong> {{ vm.autostart ? 'Enabled' : 'Disabled' }}</p>
        </div>

        <div class="form-control mt-4 flex flex-row gap-2">
          <button @click="startVm(vm)" class="btn btn-primary w-1/2">Start</button>
          <button
              @click="shutdownVm(vm)"
              :class="settings.force_shutdown ? 'btn btn-error w-1/2' : 'btn btn-warning w-1/2'"
              class="w-1/2">
            {{ settings.force_shutdown ? 'Kill' : 'Shutdown' }}
          </button>
        </div>
      </div>
    </div>


    <h1 v-if="serviceInfo.isLoaded" class="text-4xl font-bold text-center mb-6">Services</h1>
    <div v-if="serviceInfo.isLoaded" class="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
      <div
          v-for="service in serviceInfo.services"
          class="card bg-base-100 shadow-2xl p-6">
        <h2 :class="service.state === true ? 'text-green-500' : 'text-red-500'" class="text-xl font-bold text-center">
          {{ service.name }}
        </h2>
        <div class="mt-2 text-sm">
          <p><strong>Name:</strong> {{ service.name }}</p>
          <p><strong>State:</strong> {{ service.state ? "Running" : "Not Running" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


