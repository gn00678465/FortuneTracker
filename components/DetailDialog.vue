<template>
  <transition
    enter-class="opacity-0"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    leave-to-class="opacity-0"
  >
    <div v-if="show">
      <div class="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 mx-4 z-50">
        <div class="bg-primary rounded-t-xl text-center p-3">
          <ul class="text-dark flex justify-between items-center">
            <li class="inline-block mr-auto font-medium text-xl">
              {{ formatDate }}
            </li>
            <li
              class="mr-1 cursor-pointer text-secondary"
              :class="isLogin ? 'hover:text-success' : ''"
            >
              <button
                type="button"
                class="material-icons focus:outline-none
                disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!isLogin"
                @click.prevent="editHandler(id)"
              >
                mode_edit
              </button>
            </li>
            <li
              class="mr-1 cursor-pointer text-secondary"
              :class="isLogin ? 'hover:text-danger' : ''"
            >
              <button
                type="button"
                class="material-icons focus:outline-none
                disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!isLogin"
                @click.prevent="delHandler"
              >
                delete
              </button>
            </li>
            <li class="cursor-pointer text-secondary hover:text-danger">
              <a href="#" class="material-icons" @click.prevent="closeHandler">close</a>
            </li>
          </ul>
          <p class="rounded-full bg-secondary w-20 h-20 mx-auto flex items-center justify-center p-3 mb-2 select-none">
            <slot name="icon" />
          </p>
          <slot name="category" />
        </div>
        <div class="bg-secondary rounded-b-lg p-3">
          <slot name="detial" />
          <hr class="my-2 text-white border border-solid rounded-full">
          <p v-if="notes" class="text-white">
            備註：{{ notes }}
          </p>
          <p v-if="tags.length !== 0" class="text-white">
            標籤：
          </p>
        </div>
      </div>
      <div class="absolute top-0 bottom-0 left-0 right-0 bg-dark opacity-80 z-40" @click.self="$emit('update:show', false)" />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    date: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    tags: {
      type: Array
    },
    notes: {
      type: String
    }
  },
  computed: {
    // 判斷是否有登入
    isLogin () {
      return this.$store.getters['users/isLogin']
    },
    formatDate () {
      return this.$moment.unix(this.date).format('YYYY-MM-DD')
    }
  },
  methods: {
    closeHandler () {
      this.$emit('update:show', false)
    },
    editHandler (id) {
      if (!this.isLogin) {
        this.$router.push('/login')
        return
      }
      this.closeHandler()
      this.$router.push({ name: 'admin-record', params: { id, name: '編輯記帳' } })
    },
    delHandler () {
      if (!this.isLogin) {
        this.$router.push('/login')
        return
      }
      this.$store.dispatch('firebase/deleteData', this.id).then(() => {
        this.closeHandler()
      })
    }
  }
}
</script>
