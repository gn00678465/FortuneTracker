<template>
  <div>
    <ul class="text-white text-xl divide-y divide-white px-5">
      <li class="py-5 cursor-pointer hover:text-primary transition duration-300">
        <button type="button" class="focus:outline-none" @click.prevent="loginHandler">
          <span class="material-icons align-bottom mr-5">
            {{ isLogin ? 'logout' : 'login' }}
          </span>
          {{ isLogin ? '登出' : '登入' }}
        </button>
      </li>
      <li class="py-5 cursor-pointer hover:text-primary transition duration-300">
        <span class="material-icons align-bottom mr-5">edit</span>修改分類
      </li>
      <router-link v-slot="{ navigate }" to="/admin" custom>
        <li class="py-5 cursor-pointer hover:text-primary transition duration-300" @click="navigate">
          <span class="material-icons align-bottom mr-5">home</span>回首頁
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    isLogin () {
      return this.$store.getters['users/isLogin']
    }
  },
  methods: {
    loginHandler () {
      if (!this.isLogin) {
        this.$router.push('/login')
      } else {
        this.$store.dispatch('users/logout').then(() => {
          this.$router.push('/admin')
        })
      }
    }
  }
}
</script>
