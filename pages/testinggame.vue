<template>
  <ClientOnly>
    <Alerts
      :title="alertTitle"
      :message="alertMessage"
      :isVisible="alertVisible"
      :type="alertType"
      @close="alertVisible = false"
    />
    <div class="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a]">
          <h1 class="text-white text-xl font-bold text-center mb-6">
            Evolution Gaming
          </h1>

          <button
            @click="handleLaunch"
            :disabled="isLoading"
            class="w-full py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Launch Game</span>
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const { post } = useApiEndpoint();
const isLoading = ref(false);

const alertVisible = ref(false);
const alertTitle = ref("");
const alertMessage = ref("");
const alertType = ref("error");

const handleLaunch = async () => {
  try {
    isLoading.value = true;

    const { data } = await post("evolution/launchGame", {});

    if (data.success && data.gameLobby) {
      window.open(data.gameLobby, "_blank");
    } else {
      alertTitle.value = "Error";
      alertMessage.value = data.message || "Failed to launch game";
      alertType.value = "error";
      alertVisible.value = true;
    }
  } catch (error) {
    alertTitle.value = "Error";
    alertMessage.value = "Failed to launch game. Please try again.";
    alertType.value = "error";
    alertVisible.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Prevent SEO indexing
useHead({
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "googlebot", content: "noindex, nofollow" },
  ],
});
</script>
