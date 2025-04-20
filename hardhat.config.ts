import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox"; // Sudah otomatis terimpor

const config: HardhatUserConfig = {
  solidity: "0.8.24", // Pastikan versi ini cocok dengan pragma di .sol
  networks: {
    // Konfigurasi jaringan (misal testnet, mainnet) akan ditambahkan di sini nanti
  },
};

export default config;