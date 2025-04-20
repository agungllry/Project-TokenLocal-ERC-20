import { ethers } from "hardhat";

async function main() {
  // 1. Tentukan argumen untuk constructor ERC20
  const tokenName = "Token Local"; // Nama token Anda
  const tokenSymbol = "TKL";       // Simbol token Anda
  const decimals = 18;             // Jumlah desimal standar
  // Jumlah token awal (misal: 1 Juta token). parseUnits menangani penambahan desimal.
  const initialSupply = ethers.parseUnits("1000000", decimals);

  console.log(`Deploying TokenLocal with Name: ${tokenName}, Symbol: ${tokenSymbol}, InitialSupply: ${ethers.formatUnits(initialSupply, decimals)}...`);

  // 2. Dapatkan ContractFactory
  const TokenLocalFactory = await ethers.getContractFactory("TokenLocal");

  // 3. Deploy dengan argumen constructor yang baru
  const tokenLocal = await TokenLocalFactory.deploy(
    tokenName,
    tokenSymbol,
    initialSupply
  );

  // 4. Tunggu deployment selesai
  await tokenLocal.waitForDeployment();

  // 5. Dapatkan alamat kontrak
  const deployedAddress = await tokenLocal.getAddress();
  console.log(`TokenLocal deployed to address: ${deployedAddress}`);

  // (Opsional) Verifikasi sederhana setelah deploy menggunakan fungsi ERC20 standar
  try {
    const deployer = (await ethers.getSigners())[0];
    const ownerAddress = await tokenLocal.owner();
    const name = await tokenLocal.name();
    const symbol = await tokenLocal.symbol();
    const dec = await tokenLocal.decimals(); // Harus BigInt, ubah ke number jika perlu
    const totalSupply = await tokenLocal.totalSupply();
    const ownerBalance = await tokenLocal.balanceOf(ownerAddress); // Saldo owner harus sama dengan initial supply

    console.log("--- Post-Deployment Verification ---");
    console.log(`Contract Owner: ${ownerAddress} (Deployer: ${deployer.address})`);
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
    console.log(`Decimals: ${dec.toString()}`); // Konversi BigInt ke string
    console.log(`Total Supply: ${ethers.formatUnits(totalSupply, dec)} ${symbol}`);
    console.log(`Owner Balance: ${ethers.formatUnits(ownerBalance, dec)} ${symbol}`);
    console.log("------------------------------------");

    if (ownerAddress === deployer.address && name === tokenName && symbol === tokenSymbol && dec === BigInt(decimals) && totalSupply === initialSupply && ownerBalance === initialSupply) {
      console.log("Verification Successful!");
    } else {
      console.warn("Verification Issues Detected.");
    }

  } catch (e) {
    console.error("Error during post-deployment verification:", e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});