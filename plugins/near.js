// Import NEAR dependencies
import * as nearAPI from "near-api-js";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      wallet: {
        currentUser: null,
        walletConnection: null,

        async init() {
          const near = await nearAPI.connect({
            deps: {
              keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
            },
            networkId: "mainnet",
            nodeUrl: "https://rpc.mainnet.near.org",
            walletUrl: "https://app.mynearwallet.com/",
            helperUrl: "https://helper.mainnet.near.org",
          });

          const walletConnection = new nearAPI.WalletConnection(
            near,
            "Nearjs Nuxt App"
          );

          let currentUser;
          const accId = walletConnection.getAccountId();
          if (accId) {
            currentUser = {
              accountId: accId,
              balance: (await walletConnection.account().state()).amount,
            };
          }

          this.currentUser = currentUser;
          this.walletConnection = walletConnection;
        },

        async connect() {
          // Check if user is already signed in
          if (this.currentUser) {
            // If not signed in, prompt user to sign in
            await this.walletConnection.signOut();
          } else if (!this.currentUser) {
            await this.walletConnection.requestSignIn({
              contractId: "usdt.tether-token.near",
              methodNames: ["ft_metadata", "ft_transfer"],
            });
          }
        },
      },
    },
  };
});
