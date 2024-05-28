<template>
  <ClientOnly>
    <div class="container">
      <div class="profile-section">
        <button class="connect-button" @click="handleConnect">
          {{ !connected ? "Connect" : "Disconnect" }}
        </button>
        <p v-if="connected" class="account-id">
          Current Account ID: {{ accountId }}
        </p>
      </div>
      <div v-if="connected" class="metadata-section">
        <button class="metadata-button" @click="readMetadata">
          Read Token Metadata
        </button>
        <div v-if="tokenMetadata" class="token-info">
          <p>Token Name: {{ tokenMetadata?.name }}</p>
          <p>Token Symbol: {{ tokenMetadata?.symbol }}</p>
          <p>Token Decimals: {{ tokenMetadata?.decimals }}</p>
        </div>
        <div class="transfer-section">
          <label class="transfer-label">Send USDT</label>
          <input
            v-model="amount"
            type="number"
            placeholder="Amount"
            class="input-field"
          />
          <input
            v-model="receiver"
            type="text"
            placeholder="Receiver ID"
            class="input-field"
          />
          <button class="send-button" @click="stateChangeFunctionCall">
            Send
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
const { $wallet } = useNuxtApp();

const connected = ref($wallet?.currentUser !== null);
const accountId = ref($wallet?.currentUser?.accountId);
const tokenMetadata = ref(null);
const amount = ref("");
const receiver = ref("");

const initWallet = async () => {
  await $wallet.init();
  if ($wallet?.currentUser) {
    accountId.value = $wallet.currentUser.accountId;
    connected.value = true;
  } else {
    connected.value = false;
  }
};

onMounted(async () => {
  if (!$wallet.walletConnection) {
    await initWallet();
  }
});

watchEffect(async () => {
  if ($wallet && !$wallet.walletConnection) {
    await initWallet();
  }
});

const handleConnect = async () => {
  try {
    await $wallet.connect();
    await initWallet();
  } catch (error) {
    console.error("Error connecting to NEAR:", error);
  }
};

const readMetadata = async () => {
  try {
    const metadata = await $wallet.walletConnection.account().viewFunction({
      contractId: "usdt.tether-token.near",
      methodName: "ft_metadata",
    });
    console.log("Metadata: ", metadata);
    tokenMetadata.value = metadata;
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
};

const stateChangeFunctionCall = async () => {
  try {
    const functionCallRes = await $wallet.walletConnection
      .account()
      .functionCall({
        contractId: "usdt.tether-token.near",
        methodName: "ft_transfer",
        args: {
          amount: `${amount.value}`,
          receiver_id: receiver.value,
        },
        attachedDeposit: "1",
      });
    console.log("Function Call Response: ", functionCallRes);
  } catch (error) {
    console.error("Error during function call:", error);
  }
};
</script>

<style scoped>
/* Container */
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #2c3e50; /* Dark background */
  color: #ecf0f1; /* Light text */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Profile section */
.profile-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.profile-section .connect-button {
  background-color: #27ae60; /* Green */
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.profile-section .connect-button:hover {
  background-color: #219a52; /* Darker green on hover */
}

.account-id {
  font-size: 1.2em;
}

/* Metadata section */
.metadata-section .metadata-button {
  background-color: #27ae60; /* Green */
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.metadata-section .metadata-button:hover {
  background-color: #219a52; /* Darker green on hover */
}

.token-info {
  background-color: #34495e; /* Darker background for metadata */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.token-info p {
  margin: 10px 0;
}

/* Transfer section */
.transfer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.transfer-section .transfer-label {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.transfer-section .input-field {
  background-color: #2c3e50;
  color: #ecf0f1;
  border: 1px solid #34495e;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.transfer-section .send-button {
  background-color: #27ae60; /* Green */
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  width: 100%;
}

.transfer-section .send-button:hover {
  background-color: #219a52; /* Darker green on hover */
}
</style>
