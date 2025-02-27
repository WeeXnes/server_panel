<script setup lang="ts">
import {checkAuth} from "~/util/auth";

onMounted(async () => {
  let isAuthed = await checkAuth(useRouter())
})

</script>

<template>
<h1>hola</h1>
</template>

<style scoped>

</style>