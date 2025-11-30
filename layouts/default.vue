<template>
  <ClientOnly>
    <LiveChatButton />
    <CompleteProfilePopup
      :is-visible="showCompleteProfile"
      :user-data="userData"
      @close="showCompleteProfile = false"
      @updated="handleProfileUpdated"
    />
    <Alerts
      :title="alertTitle"
      :message="alertMessage"
      :isVisible="alertVisible"
      :type="alertType"
      @close="alertVisible = false"
    />
    <Notification
      :visible="notificationState.visible"
      :title="notificationState.title"
      :message="notificationState.message"
    />
    <ConfirmAlert
      :title="confirmAlertTitle"
      :message="confirmAlertMessage"
      :isVisible="isConfirmAlertVisible"
      :type="confirmAlertType"
      @close="handleConfirmClose"
    />
    <PageLoading v-if="pageLoading || gameLoading" />
    <div class="fixed inset-0 flex flex-col">
      <Header v-if="!excludeNavigationFooter" />
      <div ref="scrollContainer" class="flex-1 overflow-y-auto bg-[#030712]">
        <NuxtPage />
        <div class="max-lg:hidden" v-if="!excludeNavigationFooter">
          <Footer />
        </div>
        <div class="lg:hidden" v-if="!excludeNavigationFooter">
          <Footer />
        </div>
      </div>
      <div v-if="!excludeNavigationFooter" class="lg:hidden">
        <MobileFooter />
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
const { alertVisible, alertTitle, alertMessage, alertType, showAlert } =
  useAlert();
const { notificationState } = useNotification();
const scrollContainer = ref(null);
const pageLoading = useState("pageLoading", () => false);
const isUserLoggedIn = useState("isUserLoggedIn");
const userData = useState("userData");
const showCompleteProfile = ref(false);
const {
  isConfirmAlertVisible,
  confirmAlertTitle,
  confirmAlertMessage,
  confirmAlertType,
  showConfirmAlert,
  closeConfirmAlert,
} = useConfirmAlert();
const route = useRoute();
const gameLoading = useState("gameLoading");
const excludeNavigation = computed(() => {
  return route.path.includes("/");
});
const excludeNavigationFooter = computed(() => {
  return route.path.includes("/login") || route.path.includes("/register");
});

function handleConfirmClose(confirmed) {
  closeConfirmAlert(confirmed);
}

const scrollToElement = (targetId, headerOffset = 80) => {
  const targetElement = document.getElementById(targetId);

  if (targetElement && scrollContainer.value) {
    const containerRect = scrollContainer.value.getBoundingClientRect();
    const elementRect = targetElement.getBoundingClientRect();
    const offsetPosition =
      elementRect.top -
      containerRect.top +
      scrollContainer.value.scrollTop -
      headerOffset;

    scrollContainer.value.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

const checkProfileComplete = () => {
  if (
    isUserLoggedIn.value &&
    userData.value &&
    (userData.value.googleId || userData.value.telegramId) &&
    !userData.value.phonenumber
  ) {
    showCompleteProfile.value = true;
  }
};

watch(
  [isUserLoggedIn, userData],
  () => {
    checkProfileComplete();
  },
  { immediate: true }
);

const handleProfileUpdated = async () => {
  const { get } = useApiEndpoint();
  try {
    const { data } = await get("user");
    if (data.success) {
      userData.value = data.user;
    }
  } catch (error) {
    console.error("Failed to refresh user data:", error);
  }
};

provide("scrollToElement", scrollToElement);

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath && newPath !== oldPath) {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
    }
  }
);
</script>
<style></style>
