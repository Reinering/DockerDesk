<template>
  <q-card
    class="container-card shadow-14"
    bordered

    :style="templates[templateId]"
  >

  </q-card>
</template>

<script setup>
import { ref } from 'vue'


const templateId = ref(0)

const templates = [
  {
    backgroundColor: "#A2D0EF",
    width: "100px",
    height: "100px",
    margin: "20px",
    borderRadius: "20px",
    transition: "transform 0.2s ease",
    btn: {
      color: "blue-grey-5",
    },
  },
]


</script>

<style scoped>

.container-card:hover {
  transform: scale(1.1);
}

</style>
