<template>
  <nav ref="footer" class="absolute w-full bottom-0 text-white bg-dark py-2">
    <ul class="flex">
      <!-- <nuxt-link
        v-for="path of paths"
        :key="path.path"
        tag="li"
        class="flex-1 text-center cursor-pointer"
        :to="path.path"
      >
        <span class="material-icons text-4xl align-bottom">{{ path.icon }}</span>
        <p class="font-medium">
          {{ path.name }}
        </p>
      </nuxt-link> -->
      <router-link v-for="path of paths" :key="path.path" v-slot="{ navigate, isActive, isExactActive }" :to="{ name: path.path, params: { name: path.name }}" custom>
        <li
          :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
          class="flex-1 text-center cursor-pointer"
          @click="navigate"
        >
          <span class="material-icons text-4xl align-bottom select-none">{{ path.icon }}</span>
          <p class="font-medium select-none">
            {{ path.name }}
          </p>
        </li>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  data: () => ({
    paths: [
      {
        name: '記帳日誌',
        icon: 'event',
        path: 'admin'
      },
      {
        name: '帳戶總覽',
        icon: 'attach_money',
        path: 'admin-overview'
      },
      {
        name: '新增記帳',
        icon: 'add',
        path: 'admin-record'
      },
      {
        name: '項目分析',
        icon: 'insert_chart_outlined',
        path: 'admin-analysis'
      },
      {
        name: '設定',
        icon: 'settings',
        path: 'admin-setting'
      }
    ]
  })
}
</script>
