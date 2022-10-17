import Identities from 'orbit-db-identity-provider'
import { ethers } from "ethers";

const requestIdentity = async () => {
    let identity
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = provider.getSigner();
        await provider.send("eth_requestAccounts", []) // <- this promps user to connect metamask
        identity = await Identities.createIdentity({
          type: "ethereum",
          wallet,
        })
        console.log("web3 identity created", identity)
    } catch (ex) {
      console.log("Identity not given.")
    }
    return identity
}
export default requestIdentity;