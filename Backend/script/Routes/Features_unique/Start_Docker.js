/* global Buffer, setTimeout */
const express = require("express");
const minioClient = require("../../MINIO");
const router = express.Router();

// on import docker pour pouvoir lancer un docker
const Docker = require("dockerode");

const docker = new Docker();
// obliagtoire d'avoir des fichier tar pour passer nos vrai fichier
const tar = require("tar-stream");

router.post("/docker/start", async (req, res) => {
  try {
    const { fichierPaths } = req.body;

    if (!fichierPaths) {
      return res.status(400).json({ msg: "fichierPath is required" });
    }

    const pack = tar.pack();

    for (const fichierPath of fichierPaths) {
      const chunks = [];
      const stream = await minioClient.getObject("candidatures", fichierPath);
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
      const fileName = fichierPath.split("/").pop();

      pack.entry({ name: fileName, size: fileBuffer.length }, fileBuffer);
    }
    pack.finalize();

    // Convertir le tar stream en buffer
    const tarChunks = [];
    for await (const chunk of pack) {
      tarChunks.push(chunk);
    }
    const tarBuffer = Buffer.concat(tarChunks);

    // on creer le container
    const container = await docker.createContainer({
      // on met des secu, 50 % cpu, on limite la ram, le temps d'activite, on coupe internet, ...
      Image: "sandbox-ide",
      name: `sandbox-${Date.now()}`,
      Env: ["PASSWORD=temp-session-token"],
      HostConfig: {
        Memory: 512 * 1024 * 1024, // on limite la ram
        CpuPeriod: 100000,
        CpuQuota: 50000, // 50% cpu max
        AutoRemove: true,
        PortBindings: { "8080/tcp": [{ HostPort: "0" }] },
        ReadonlyRootfs: false,
        SecurityOpt: ["no-new-privileges"], // on degage l'escalade de privilege
        CapDrop: ["ALL"], // on degage toute les capacite sur inernet
        CapAdd: ["NET_RAW", "NET_ADMIN"], // on autorise uniquement les pip et npm
      },
      ExposedPorts: { "8080/tcp": {} },
    });

    // on start
    await container.start();

    // on lance le firewall de securite
    const exec = await container.exec({
      Cmd: ["sudo", "/usr/local/bin/sandbox-firewall.sh"],
      User: "root",
    });
    await exec.start();

    // on copie le fichier tar dans le conteneur
    await container.putArchive(tarBuffer, { path: "/home/coder" });

    // on le rend publique
    const info = await container.inspect(); //recup tt info du conatiner en cours
    const port = info.NetworkSettings.Ports["8080/tcp"][0].HostPort;

    // lancement automatiquement uniquement apres que ca a charge
    await new Promise((r) => setTimeout(r, 5000));

    // on le destroy apres 30 min d'utilisation
    setTimeout(() => container.stop().catch(() => {}), 30 * 60 * 1000);

    return res.status(200).json({
      url: `http://localhost:${port}`,
      containerId: container.id,
    });
  } catch (err) {
    console.error("Sandbox error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
