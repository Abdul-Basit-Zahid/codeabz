const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://github.com/Abdul-Basit-Zahid/codeabz" : `https://${stage}.github.com/Abdul-Basit-Zahid/codeabz`,
  console: stage === "production" ? "https://github.com/Abdul-Basit-Zahid/codeabz/auth" : `https://${stage}.github.com/Abdul-Basit-Zahid/codeabz/auth`,
  email: "help@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/Abdul-Basit-Zahid/codeabz",
  discord: "https://github.com/Abdul-Basit-Zahid/codeabz/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
