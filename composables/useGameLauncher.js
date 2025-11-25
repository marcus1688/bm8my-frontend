export const useGameLauncher = () => {
  const { post } = useApiEndpoint();
  const localePath = useLocalePath();
  const router = useRouter();
  const userData = useState("userData");
  const userGameLocks = useState("userGameLocks");
  const gameLoading = useState("gameLoading", () => false);
  const gameCredentialsModal = ref(false);
  const gameCredentials = ref(null);
  const alertVisible = ref(false);
  const alertTitle = ref("");
  const alertMessage = ref("");
  const alertType = ref("");

  const isMobileDevice = () => {
    return window.innerWidth < 1023;
  };

  const launchGame = async (game) => {
    if (!userData.value) {
      alertTitle.value = $t("info");
      alertMessage.value = $t("login_required");
      alertType.value = "info";
      alertVisible.value = true;
      return;
    }
    if (userGameLocks.value?.[game.databaseName]?.lock === true) {
      alertTitle.value = $t("alert_error");
      alertMessage.value = $t("game_locked_message");
      alertType.value = "error";
      alertVisible.value = true;
      return;
    }
    gameLoading.value = true;
    const getValidGameToken = async () => {
      try {
        let gameToken = localStorage.getItem("gametoken");
        if (!gameToken) {
          return await generateNewGameToken();
        }
        const { data } = await post("game-token-validtest", {
          gameToken,
        });
        if (!data?.success) {
          localStorage.removeItem("gametoken");
          return await generateNewGameToken();
        }
        return gameToken;
      } catch (error) {
        console.error("Error validating game token:", error);
        return null;
      }
    };

    const generateNewGameToken = async () => {
      try {
        localStorage.removeItem("gametoken");
        const { data } = await post("game-token");
        if (data.success) {
          localStorage.setItem("gametoken", data.gameToken);
          return data.gameToken;
        } else {
          console.error("Failed to generate new game token:", data);
          return null;
        }
      } catch (error) {
        console.error("Error generating new game token:", error);
        return null;
      }
    };

    const gameToken = await getValidGameToken();

    if (
      (game.gameListLink || game.isManualGame || game.isHTMLGame) &&
      !game.gameCode
    ) {
      let targetPath = "/games/slots";
      let stateVariable = "selectedSlotProvider";
      switch (game?.categoryId?.name) {
        case "Slot Games":
          targetPath = "/games/slots";
          stateVariable = "selectedSlotProvider";
          break;
        case "Lottery":
          targetPath = "/games/lottery";
          stateVariable = "selectedLotteryProvider";
          break;
        case "Fishing":
          targetPath = "/games/fishing";
          stateVariable = "selectedFishingProvider";
          break;
        case "E-Sports":
          targetPath = "/games/e-sports";
          stateVariable = "selectedESportsProvider";
          break;
        case "Sports":
          targetPath = "/games/sports";
          stateVariable = "selectedSportsProvider";
          break;
        case "Live Casino":
          targetPath = "/games/livecasino";
          stateVariable = "selectedLiveCasinoProvider";
          break;
        default:
          console.warn("Unknown game category:", game?.categoryId?.name);
          targetPath = "/games/slots";
          stateVariable = "selectedSlotProvider";
      }
      useState(stateVariable).value = game;
      const currentPath = window.location.pathname;
      if (currentPath !== targetPath) {
        router.push(localePath(targetPath));
        gameLoading.value = false;
        return;
      }
      gameLoading.value = false;
      return;
    }

    try {
      const requestBody = {
        gameLang: $locale.value || "en",
        gameType: game.categoryId.name,
        clientPlatform: isMobileDevice() ? "mobile" : "web",
      };

      if (game.isManualGame) {
        const response = await post(game.apiLink, requestBody);
        console.log(response.data);
        if (response?.data?.success) {
          gameCredentials.value = {
            username: response.data.userData.userId,
            password: response.data.userData.password,
            downloadUrl: game.downloadUrl,
            iosDownloadUrl: game.iosDownloadUrl,
            androidDownloadUrl: game.androidDownloadUrl,
            gameName: game.name,
            gameLogo: game.logo,
            changePasswordApi: game.changePasswordApi,
          };
          gameCredentialsModal.value = true;
          gameLoading.value = false;
          return;
        }
      }

      if (game.name === "Sexybcrt") {
        requestBody.gameCode = 1022;
        requestBody.gameType = "LIVE_CASINO";
      }

      if (game.name === "Yeebet") {
        requestBody.gameCode = 1016;
        requestBody.gameType = "LIVE_CASINO";
      }
      if (game.name === "WM Casino") {
        requestBody.gameCode = 1020;
        requestBody.gameType = "LIVE_CASINO";
      }

      if (game.name === "Evolution") {
        requestBody.gameCode = 1002;
        requestBody.gameType = "LIVE_CASINO";
      }

      if (game.name === "Dream Gaming") {
        requestBody.gameCode = 1052;
        requestBody.gameType = "LIVE_CASINO";
      }

      if (game.name === "Big Gaming") {
        requestBody.gameCode = 1004;
        requestBody.gameType = "LIVE_CASINO";
      }

      if (game.name === "TF Gaming") {
        requestBody.gameCode = 1222;
        requestBody.gameType = "ESPORT";
      }

      if (game.name === "JDB") {
        if (game?.categoryId?.name === "Slot Games") {
          requestBody.gameType = "SLOT";
        } else if (game?.categoryId?.name === "Fishing") {
          requestBody.gameType = "FISHING";
        }
      }

      if (gameToken) {
        requestBody.gameToken = gameToken;
      }

      if (game.gameCode) {
        requestBody.gameCode = game.gameCode;

        if (game.name !== "JDB" || !requestBody.gameType) {
          requestBody.gameType = game.gameType;
        }
        const response = await post(game.apiLink, requestBody);
        gameLoading.value = false;
        if (response?.data?.success === false) {
          alertTitle.value = $t("info");
          alertMessage.value =
            response.data.message[$locale.value] || response.data.message.en;
          alertType.value = "info";
          alertVisible.value = true;
        } else if (response?.data?.gameLobby) {
          const newWindow = window.open(response.data.gameLobby, "_blank");
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            window.location.href = response.data.gameLobby;
          }
        }
      } else {
        const response = await post(game.apiLink, requestBody);
        gameLoading.value = false;
        console.log(response.data);
        if (response?.data?.success === false) {
          alertTitle.value = $t("info");
          alertMessage.value =
            response.data.message[$locale.value] || response.data.message.en;
          alertType.value = "info";
          alertVisible.value = true;
        } else if (response?.data?.gameLobby) {
          const newWindow = window.open(response.data.gameLobby, "_blank");
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            window.location.href = response.data.gameLobby;
          }
        }
      }
    } catch (error) {
      console.error("Failed to launch game:", error);
    } finally {
      gameLoading.value = false;
    }
  };

  return {
    launchGame,
    gameLoading,
    gameCredentialsModal,
    gameCredentials,
    alertVisible,
    alertTitle,
    alertMessage,
    alertType,
  };
};
