import { BrowserProvider, parseUnits, formatUnits, Contract } from "ethers";

// Celo Mainnet
export const CELO_CHAIN_ID = 42220;
export const CELO_CHAIN_ID_HEX = "0xa4ec";

// cUSD token contract on Celo mainnet
export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282";

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export function getInjectedProvider() {
  if (typeof window === "undefined") return null;
  // MiniPay injects window.ethereum just like any EIP-1193 wallet
  const eth = (window as any).ethereum;
  return eth ?? null;
}

export function isMiniPay() {
  const eth = getInjectedProvider();
  return Boolean(eth?.isMiniPay);
}

export async function connectWallet(): Promise<string | null> {
  const eth = getInjectedProvider();
  if (!eth) return null;

  const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });

  // Try to switch to Celo mainnet; MiniPay is already on Celo, this is a no-op there.
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CELO_CHAIN_ID_HEX }],
    });
  } catch {
    // ignore — MiniPay locks users to Celo already
  }

  return accounts[0] ?? null;
}

export async function sendPulse(toAddress: string, amountCUSD: string) {
  const eth = getInjectedProvider();
  if (!eth) throw new Error("No wallet found");

  const provider = new BrowserProvider(eth);
  const signer = await provider.getSigner();
  const token = new Contract(CUSD_ADDRESS, ERC20_ABI, signer);

  const amount = parseUnits(amountCUSD, 18);
  const tx = await token.transfer(toAddress, amount);
  const receipt = await tx.wait();
  return receipt?.hash as string;
}

export async function getCUSDBalance(address: string): Promise<string> {
  const eth = getInjectedProvider();
  if (!eth) return "0";
  const provider = new BrowserProvider(eth);
  const token = new Contract(CUSD_ADDRESS, ERC20_ABI, provider);
  const bal = await token.balanceOf(address);
  return formatUnits(bal, 18);
}

export function shortAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
