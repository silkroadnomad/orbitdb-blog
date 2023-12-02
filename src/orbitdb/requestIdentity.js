import Identities from 'orbit-db-identity-provider'
import { ethers } from "ethers";
import {log} from '../utils/loaderPrettyLog.js'
const requestIdentity = async () => {
    let identity
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = provider.getSigner();
        await provider.send("eth_requestAccounts", []) // <- this prompts user to connect metamask
        identity = await Identities.createIdentity({
          type: "ethereum",
          wallet,
        })
      log.action("Web3 identity created.", identity)
    } catch (ex) {
      log.error("Identity not provided.")
    }
    return identity
}
export default requestIdentity;