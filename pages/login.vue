<template>
  <div class="flex items-center justify-center py-16">
    <div class="card w-96 bg-base-100 shadow-2xl p-6">
      <h2 class="text-2xl font-bold text-center">Login</h2>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">E-Mail</span>
          </label>
          <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="input input-bordered"
              required
          />
        </div>

        <div class="form-control mt-2">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="input input-bordered"
              required
          />
        </div>

        <div class="form-control mt-4">
          <button type="submit" class="btn btn-primary w-full">Login</button>
        </div>
      </form>

      <div class="mt-4 text-center text-sm">
        <p>Don't have an account? <a href="/register" class="text-blue-500 hover:underline">Register here</a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {

    }
  }
};

</script>